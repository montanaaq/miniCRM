begin;

alter table public.objects add column version integer not null default 1;
alter table public.tasks add column version integer not null default 1;

create function private.bump_record_version() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.version := old.version + 1;
  return new;
end;
$$;

create trigger objects_bump_version before update on public.objects
for each row execute function private.bump_record_version();
create trigger tasks_bump_version before update on public.tasks
for each row execute function private.bump_record_version();

revoke all on function private.bump_record_version() from public, anon, authenticated;

commit;
