begin;

create type public.app_role as enum ('manager', 'executor');
create type public.task_status as enum ('new', 'in_progress', 'review', 'accepted', 'revision');

create table public.profiles (
  id uuid primary key references auth.users(id),
  name text not null check (length(trim(name)) between 1 and 120),
  role public.app_role not null
);
create table public.objects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 160),
  address text not null check (length(trim(address)) between 1 and 300),
  deleted_at timestamptz
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 200),
  description text not null default '' check (length(description) <= 10000),
  object_id uuid not null references public.objects(id),
  assignee_id uuid not null references public.profiles(id),
  author_id uuid not null default auth.uid() references public.profiles(id),
  status public.task_status not null default 'new',
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create table public.task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id),
  actor_id uuid not null references public.profiles(id),
  from_status public.task_status,
  to_status public.task_status not null,
  comment text check (length(comment) <= 2000),
  created_at timestamptz not null default clock_timestamp()
);
create index tasks_assignee_idx on public.tasks(assignee_id);
create index tasks_object_idx on public.tasks(object_id);
create index history_task_idx on public.task_history(task_id, created_at);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;
create function private.is_manager() returns boolean language sql stable security definer
set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'manager');
$$;
revoke all on function private.is_manager() from public, anon;
grant execute on function private.is_manager() to authenticated;

alter table public.profiles enable row level security;
alter table public.objects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_history enable row level security;

create policy profiles_read on public.profiles for select to authenticated using (
  id = auth.uid() or private.is_manager() or exists (
    select 1 from public.tasks t where t.assignee_id = auth.uid() and t.author_id = profiles.id
  ) or exists (
    select 1 from public.task_history h join public.tasks t on t.id = h.task_id
    where t.assignee_id = auth.uid() and h.actor_id = profiles.id
  )
);
create policy objects_read on public.objects for select to authenticated using (
  private.is_manager() or (deleted_at is null and exists (
    select 1 from public.tasks t where t.object_id = objects.id and t.assignee_id = auth.uid() and t.deleted_at is null
  ))
);
-- Task visibility deliberately does not query objects: this avoids recursive RLS policies.
create policy tasks_read on public.tasks for select to authenticated using (
  private.is_manager() or (deleted_at is null and assignee_id = auth.uid())
);
create policy history_read on public.task_history for select to authenticated using (
  exists(select 1 from public.tasks t where t.id = task_id)
);
create policy objects_insert on public.objects for insert to authenticated with check (private.is_manager() and deleted_at is null);
create policy objects_update on public.objects for update to authenticated using (private.is_manager()) with check (private.is_manager());
create policy tasks_insert on public.tasks for insert to authenticated with check (private.is_manager());
create policy tasks_update on public.tasks for update to authenticated using (private.is_manager()) with check (private.is_manager());

-- Explicit column grants keep author, timestamps and status outside the writable API.
revoke all on public.profiles, public.objects, public.tasks, public.task_history from anon, authenticated;
grant select on public.profiles, public.objects, public.tasks, public.task_history to authenticated;
grant insert (name, address), update (name, address, deleted_at) on public.objects to authenticated;
grant insert (title, description, object_id, assignee_id), update (title, description, object_id, assignee_id, deleted_at) on public.tasks to authenticated;

create function private.validate_task() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.objects where id = new.object_id and deleted_at is null for share;
  if not found then
    raise exception 'Object unavailable' using errcode = '23514';
  end if;
  if not exists(select 1 from public.profiles where id = new.assignee_id and role = 'executor') then
    raise exception 'Assignee must be executor' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger validate_task before insert or update of object_id, assignee_id on public.tasks
for each row execute function private.validate_task();

create function private.record_creation() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.task_history(task_id, actor_id, to_status) values(new.id, new.author_id, new.status);
  return new;
end;
$$;
create trigger task_created after insert on public.tasks for each row execute function private.record_creation();

create function public.change_task_status(p_task_id uuid, p_expected_status public.task_status, p_status public.task_status, p_comment text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_task public.tasks;
  v_manager boolean := private.is_manager();
  v_comment text := nullif(trim(p_comment), '');
begin
  select * into v_task from public.tasks where id = p_task_id and deleted_at is null for update;
  if not found or auth.uid() is null or (not v_manager and v_task.assignee_id <> auth.uid()) then
    raise exception 'Task unavailable' using errcode = '42501';
  end if;
  if v_task.status is distinct from p_expected_status then
    raise exception 'Task changed; reload' using errcode = '40001';
  end if;
  if not (
    (not v_manager and v_task.assignee_id = auth.uid() and (
      (v_task.status in ('new', 'revision') and p_status = 'in_progress') or
      (v_task.status = 'in_progress' and p_status = 'review')
    )) or
    (v_manager and v_task.status = 'review' and p_status in ('accepted', 'revision'))
  ) then
    raise exception 'Invalid transition' using errcode = '23514';
  end if;
  if p_status = 'revision' and v_comment is null then
    raise exception 'Comment required' using errcode = '23514';
  end if;
  if length(v_comment) > 2000 then
    raise exception 'Comment too long' using errcode = '23514';
  end if;
  update public.tasks set status = p_status where id = v_task.id;
  insert into public.task_history(task_id, actor_id, from_status, to_status, comment)
  values(v_task.id, auth.uid(), v_task.status, p_status, v_comment);
end;
$$;
revoke all on function public.change_task_status(uuid, public.task_status, public.task_status, text) from public, anon;
grant execute on function public.change_task_status(uuid, public.task_status, public.task_status, text) to authenticated;
revoke all on function private.validate_task(), private.record_creation() from public, anon, authenticated;

-- Objects can only be removed after their tasks, preserving consistent task visibility.
create function private.validate_object_deletion() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.deleted_at is not null and exists(select 1 from public.tasks where object_id = new.id and deleted_at is null) then
    raise exception 'Delete tasks first' using errcode = '23503';
  end if;
  return new;
end;
$$;
create trigger object_deleting before update of deleted_at on public.objects for each row execute function private.validate_object_deletion();
revoke all on function private.validate_object_deletion() from public, anon, authenticated;

commit;
