-- First create these users in Authentication > Users > Add user with email confirmed.
-- Choose passwords yourself; this file contains no credentials.
begin;
do $$ begin
  if (select count(*) from auth.users where email in ('manager@minicrm.test', 'executor1@minicrm.test', 'executor2@minicrm.test')) <> 3 then
    raise exception 'Create manager@minicrm.test, executor1@minicrm.test and executor2@minicrm.test first';
  end if;
end $$;
insert into public.profiles(id, name, role)
select id,
  case email when 'manager@minicrm.test' then 'Анна Смирнова' when 'executor1@minicrm.test' then 'Иван Петров' else 'Алексей Волков' end,
  case when email = 'manager@minicrm.test' then 'manager'::public.app_role else 'executor'::public.app_role end
from auth.users where email in ('manager@minicrm.test', 'executor1@minicrm.test', 'executor2@minicrm.test')
on conflict (id) do nothing;
insert into public.objects(id, name, address) values
  ('a0000000-0000-0000-0000-000000000001', 'ЖК «Сосновый квартал»', 'Казань, ул. Лесная, 12'),
  ('a0000000-0000-0000-0000-000000000002', 'Бизнес-центр «Горизонт»', 'Казань, ул. Строителей, 8'),
  ('a0000000-0000-0000-0000-000000000003', 'Складской комплекс «Север»', 'Казань, Северное шоссе, 24')
on conflict (id) do nothing;
do $$
declare
  v_manager uuid := (select id from auth.users where email='manager@minicrm.test');
  v_first uuid := (select id from auth.users where email='executor1@minicrm.test');
  v_second uuid := (select id from auth.users where email='executor2@minicrm.test');
  v_item record;
  v_id uuid;
  v_assignee uuid;
begin
  for v_item in select * from (values
    (1, 'Проверить армирование перекрытия', 'Сверить шаг арматуры с проектом перед заливкой.', 1, 1, 'new'),
    (2, 'Выполнить монтаж перегородок', 'Смонтировать перегородки на третьем этаже.', 1, 2, 'in_progress'),
    (3, 'Проверить систему вентиляции', 'Проверить тягу и крепления воздуховодов.', 2, 1, 'review'),
    (4, 'Исправить отделку откосов', 'Проверить геометрию и качество примыканий.', 2, 2, 'revision'),
    (5, 'Подготовить основание пола', 'Убрать мусор, проверить отметки и принять основание.', 3, 1, 'accepted'),
    (6, 'Установить освещение склада', 'Установить светильники в зоне разгрузки.', 3, 1, 'new')
  ) as items(number, title, description, object_number, executor_number, target_status)
  loop
    v_id := ('b0000000-0000-0000-0000-' || lpad(v_item.number::text,12,'0'))::uuid;
    v_assignee := case when v_item.executor_number=1 then v_first else v_second end;
    if exists(select 1 from public.tasks where id=v_id) then continue; end if;
    perform set_config('request.jwt.claim.sub',v_manager::text,true);
    insert into public.tasks(id,title,description,object_id,assignee_id,author_id)
    values(v_id,v_item.title,v_item.description,('a0000000-0000-0000-0000-' || lpad(v_item.object_number::text,12,'0'))::uuid,v_assignee,v_manager);
    if v_item.target_status='new' then continue; end if;
    perform set_config('request.jwt.claim.sub',v_assignee::text,true);
    perform public.change_task_status(v_id,'new','in_progress');
    if v_item.target_status='in_progress' then continue; end if;
    perform public.change_task_status(v_id,'in_progress','review');
    if v_item.target_status='review' then continue; end if;
    perform set_config('request.jwt.claim.sub',v_manager::text,true);
    perform public.change_task_status(v_id,'review',v_item.target_status::public.task_status,
      case when v_item.target_status='revision' then 'На двух окнах неровные примыкания. Исправьте и отправьте повторно.' else 'Работа соответствует проекту.' end);
  end loop;
end $$;
commit;
