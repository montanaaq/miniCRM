begin;

alter policy profiles_read on public.profiles using (
  id = (select auth.uid()) or (select private.is_manager()) or exists (
    select 1 from public.tasks t where t.assignee_id = (select auth.uid()) and t.author_id = profiles.id
  ) or exists (
    select 1 from public.task_history h join public.tasks t on t.id = h.task_id
    where t.assignee_id = (select auth.uid()) and h.actor_id = profiles.id
  )
);
alter policy objects_read on public.objects using (
  (select private.is_manager()) or (deleted_at is null and exists (
    select 1 from public.tasks t where t.object_id = objects.id and t.assignee_id = (select auth.uid()) and t.deleted_at is null
  ))
);
alter policy tasks_read on public.tasks using (
  (select private.is_manager()) or (deleted_at is null and assignee_id = (select auth.uid()))
);
alter policy objects_insert on public.objects with check ((select private.is_manager()) and deleted_at is null);
alter policy objects_update on public.objects using ((select private.is_manager())) with check ((select private.is_manager()));
alter policy tasks_insert on public.tasks with check ((select private.is_manager()));
alter policy tasks_update on public.tasks using ((select private.is_manager())) with check ((select private.is_manager()));

commit;
