begin;

create or replace function public.change_task_status(p_task_id uuid, p_expected_status public.task_status, p_status public.task_status, p_comment text default null)
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
  if p_status = 'revision' and (v_comment is null or v_comment !~ '[^[:space:]]') then
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

commit;
