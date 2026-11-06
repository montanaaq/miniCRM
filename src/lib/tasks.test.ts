import type { Profile, Status, Task } from '@/shared/types/crm.schema'

import { describe, expect, it } from 'vite-plus/test'

import { getAvailableActions } from './tasks'

const EXECUTOR: Profile = { id: 'executor', name: 'Исполнитель', role: 'executor' }
const MANAGER: Profile = { id: 'manager', name: 'Руководитель', role: 'manager' }
const TASK: Task = {
  id: 'task',
  title: 'Монтаж',
  description: '',
  object_id: 'object',
  author_id: 'manager',
  assignee_id: 'executor',
  status: 'new',
  created_at: '2026-11-05T08:00:00Z',
  version: 1,
  deleted_at: null
}
const CASES: [Status, Status[], Status[]][] = [
  ['new', ['in_progress'], []],
  ['in_progress', ['review'], []],
  ['review', [], ['accepted', 'revision']],
  ['revision', ['in_progress'], []],
  ['accepted', [], []]
]

describe('Доступные действия', () => {
  it.each(CASES)('%s: действия зависят от роли', (status, executorActions, managerActions) => {
    expect(getAvailableActions({ ...TASK, status }, EXECUTOR)).toEqual(executorActions)
    expect(getAvailableActions({ ...TASK, status }, MANAGER)).toEqual(managerActions)
  })
  it('не показывает исполнителю действия по чужой задаче', () => {
    for (const [status] of CASES)
      expect(getAvailableActions({ ...TASK, status, assignee_id: 'other' }, EXECUTOR)).toEqual([])
  })
})
