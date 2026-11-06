import type { ConstructionObject, Profile, Task } from '@/shared/types/crm.schema'
import type { TaskListSearch } from '@/shared/types/task-list-search'

import { TASK_LIST_SEARCH_SCHEMA } from '@/shared/types/task-list-search'
import { useNavigate, useSearch } from '@tanstack/react-router'

export interface TaskListRow {
  task: Task
  assignee: string
  objectName: string
}

export const getTaskListStates = (
  tasks: Task[],
  profiles: Profile[],
  objects: ConstructionObject[],
  { view, ...filters }: TaskListSearch
) => {
  const search = filters.search?.trim().toLocaleLowerCase('ru')
  const rows: TaskListRow[] = tasks.map(task => ({
    task,
    assignee: profiles.find(profile => profile.id === task.assignee_id)?.name ?? 'Исполнитель',
    objectName: objects.find(object => object.id === task.object_id)?.name ?? 'Объект'
  }))
  const visibleRows = rows.filter(
    ({ task, assignee, objectName }) =>
      (!filters.status || task.status === filters.status) &&
      (!filters.objectId || task.object_id === filters.objectId) &&
      (!filters.assigneeId || task.assignee_id === filters.assigneeId) &&
      (!search ||
        [task.title, objectName, assignee].some(value =>
          value.toLocaleLowerCase('ru').includes(search)
        ))
  )
  return {
    view: view ?? 'board',
    filters,
    rows: visibleRows,
    filtered: Object.values(filters).some(value => !!value?.trim()),
    objects: objects.filter(object => tasks.some(task => task.object_id === object.id)),
    assignees: profiles.filter(profile => tasks.some(task => task.assignee_id === profile.id))
  }
}

export const useTaskList = (tasks: Task[], profiles: Profile[], objects: ConstructionObject[]) => {
  const search = useSearch({ strict: false })
  const navigate = useNavigate()
  return {
    states: getTaskListStates(tasks, profiles, objects, TASK_LIST_SEARCH_SCHEMA.parse(search)),
    functions: {
      onFilter: (patch: Partial<Record<keyof TaskListSearch, string>>) =>
        void navigate({
          to: '.',
          replace: true,
          resetScroll: false,
          search: previous => TASK_LIST_SEARCH_SCHEMA.parse({ ...previous, ...patch })
        }),
      onReset: () =>
        void navigate({
          to: '.',
          replace: true,
          resetScroll: false,
          search: ({ view }) => ({ view })
        })
    }
  }
}
