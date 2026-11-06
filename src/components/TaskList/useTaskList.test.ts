import type { ConstructionObject, Profile, Task } from '@/shared/types/crm.schema'
import type { TaskListSearch } from '@/shared/types/task-list-search'

import { describe, expect, it } from 'vite-plus/test'

import { getTaskListStates } from './useTaskList'

const objects: ConstructionObject[] = [
  { id: 'house', name: 'Жилой дом', address: 'Лесная', version: 1, deleted_at: null },
  { id: 'school', name: 'Школа', address: 'Полевая', version: 1, deleted_at: null }
]
const profiles: Profile[] = [
  { id: 'anna', name: 'Анна', role: 'executor' },
  { id: 'ivan', name: 'Иван', role: 'executor' }
]
const base: Task = {
  id: '1',
  title: 'Монтаж окон',
  description: '',
  object_id: 'house',
  assignee_id: 'anna',
  author_id: 'manager',
  status: 'review',
  created_at: '2026-11-05T08:00:00Z',
  version: 1,
  deleted_at: null
}
const tasks: Task[] = [
  base,
  { ...base, id: '2', title: 'Монтаж дверей', assignee_id: 'ivan', status: 'new' },
  { ...base, id: '3', title: 'Отделка', object_id: 'school', assignee_id: 'ivan' }
]
const list = (filters: TaskListSearch = {}, items = tasks) =>
  getTaskListStates(items, profiles, objects, filters)
const ids = (filters?: TaskListSearch) => list(filters).rows.map(row => row.task.id)

describe('Поиск и фильтры задач', () => {
  it('ищет без учёта регистра и пробелов по названию, объекту и исполнителю', () => {
    expect(ids({ search: '  МОНТАЖ  ' })).toEqual(['1', '2'])
    expect(ids({ search: 'школа' })).toEqual(['3'])
    expect(ids({ search: 'анна' })).toEqual(['1'])
  })
  it('применяет фильтры совместно, а вид списка не влияет на результаты', () => {
    const filters = {
      status: 'review',
      objectId: 'house',
      assigneeId: 'anna',
      search: 'монтаж'
    } as const
    expect(ids(filters)).toEqual(['1'])
    expect(ids({ ...filters, assigneeId: 'ivan' })).toEqual([])
    expect(list(filters).filtered).toBe(true)
    const table = list({ view: 'table' })
    expect(table.view).toBe('table')
    expect(table.rows.map(row => row.task.id)).toEqual(['1', '2', '3'])
    expect(table.filtered).toBe(false)
  })
  it('обновляет результаты при изменении доступных задач, не изменяя исходные данные', () => {
    const filtered = list({ status: 'review' }, [tasks[1]])
    expect(filtered.rows).toEqual([])
    expect(filtered.objects.map(object => object.id)).toEqual(['house'])
    expect(filtered.assignees.map(profile => profile.id)).toEqual(['ivan'])
    expect(tasks.map(task => task.id)).toEqual(['1', '2', '3'])
  })
})
