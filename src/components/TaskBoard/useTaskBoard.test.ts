// @vitest-environment happy-dom
import type { TaskListRow } from '@/components/TaskList/useTaskList'
import type { Profile, Task } from '@/shared/types/crm.schema'

import * as api from '@/lib/api'
import { UserContext } from '@/shared/contexts/user/UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, createElement, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { useTaskBoard } from './useTaskBoard'

const manager: Profile = { id: 'manager', name: 'Анна', role: 'manager' }
const executor: Profile = { id: 'executor', name: 'Иван', role: 'executor' }
const task: Task = {
  id: 'task',
  title: 'Монтаж',
  description: '',
  object_id: 'object',
  assignee_id: 'executor',
  author_id: 'manager',
  status: 'review',
  created_at: '2026-11-05T08:00:00Z',
  version: 1,
  deleted_at: null
}
let result: ReturnType<typeof useTaskBoard> | undefined
let root: ReturnType<typeof createRoot>
let client: QueryClient
const Probe = ({ rows }: { rows: TaskListRow[] }) => {
  const value = useTaskBoard(rows)
  useLayoutEffect(() => {
    result = value
  })
  return null
}
const current = () => {
  if (!result) throw new Error('Task board is not mounted')
  return result
}
const mount = (user = manager, item = task) =>
  act(() =>
    root.render(
      createElement(
        QueryClientProvider,
        { client },
        createElement(
          UserContext,
          { value: { user } },
          createElement(Probe, { rows: [{ task: item, objectName: 'Дом', assignee: 'Иван' }] })
        )
      )
    )
  )
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(api, 'changeStatus').mockResolvedValue(undefined)
  result = undefined
  client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  root = createRoot(document.createElement('div'))
})
afterEach(() => {
  act(() => root.unmount())
  client.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Перенос задач между статусами', () => {
  it('сохраняет разрешённый перенос исполнителя через существующий API', async () => {
    const newTask = { ...task, status: 'new' as const }
    mount(executor, newTask)
    act(() => current().functions.onDragStart(task.id))
    expect(current().states.targets).toEqual(['in_progress'])
    await act(async () => current().functions.onDragEnd('in_progress'))
    expect(api.changeStatus).toHaveBeenCalledExactlyOnceWith(newTask, 'in_progress', '')
    expect(current().states.draggedTask).toBeNull()
    expect(current().states.announcement).toContain('В работе')
  })
  it('не отправляет запрос при отмене, сбросе вне колонки или недоступном переходе', async () => {
    mount()
    act(() => current().functions.onDragStart(task.id))
    act(() => current().functions.onDragCancel())
    await act(async () => current().functions.onDragEnd('accepted'))
    act(() => current().functions.onDragStart(task.id))
    await act(async () => current().functions.onDragEnd(null))
    await act(async () => current().functions.onMove(task, 'in_progress'))
    expect(api.changeStatus).not.toHaveBeenCalled()
  })
  it('не разрешает исполнителю переносить чужую задачу', async () => {
    const otherTask = { ...task, assignee_id: 'other', status: 'new' as const }
    mount(executor, otherTask)
    act(() => current().functions.onDragStart(task.id))
    expect(current().states.draggedTask).toBeNull()
    await act(async () => current().functions.onMove(otherTask, 'in_progress'))
    expect(api.changeStatus).not.toHaveBeenCalled()
  })
  it('запрашивает комментарий до возврата и позволяет отменить без изменения статуса', async () => {
    mount()
    await act(async () => current().functions.onMove(task, 'revision'))
    expect(current().states.revisionTask).toEqual(task)
    act(() => current().functions.onCommentChange('   '))
    await act(async () => current().functions.onConfirmRevision())
    expect(current().states.commentError).toBeTruthy()
    expect(api.changeStatus).not.toHaveBeenCalled()
    act(() => current().functions.onCancelRevision())
    expect(current().states.revisionTask).toBeNull()
  })
  it('сохраняет комментарий после ошибки и закрывает окно только после успешного повтора', async () => {
    vi.mocked(api.changeStatus).mockRejectedValueOnce({ code: '40001' })
    mount()
    await act(async () => current().functions.onMove(task, 'revision'))
    act(() => current().functions.onCommentChange('Исправить крепления'))
    await act(async () => current().functions.onConfirmRevision())
    expect(current().states.error).toContain('уже изменилась')
    expect(current().states.revisionTask).toEqual(task)
    expect(current().states.comment).toBe('Исправить крепления')
    expect(current().states.announcement).toBe('')
    await act(async () => current().functions.onConfirmRevision())
    expect(api.changeStatus).toHaveBeenCalledTimes(1)
    const refreshed = { ...task, title: 'Актуальная задача', version: 2 }
    vi.spyOn(api, 'loadWorkspace').mockResolvedValue({
      tasks: [refreshed],
      objects: [],
      profiles: []
    })
    await act(async () => current().functions.onRefreshRevision())
    expect(current().states.comment).toBe('Исправить крепления')
    await act(async () => current().functions.onConfirmRevision())
    expect(api.changeStatus).toHaveBeenLastCalledWith(refreshed, 'revision', 'Исправить крепления')
    expect(current().states.revisionTask).toBeNull()
    expect(current().states.announcement).toContain('на доработку')
  })
  it('после обновления запрещает возврат принятой задачи и сохраняет комментарий', async () => {
    vi.mocked(api.changeStatus).mockRejectedValueOnce({ code: '40001' })
    vi.spyOn(api, 'loadWorkspace').mockResolvedValue({
      tasks: [{ ...task, status: 'accepted', version: 2 }],
      objects: [],
      profiles: []
    })
    mount()
    await act(async () => current().functions.onMove(task, 'revision'))
    act(() => current().functions.onCommentChange('Исправить крепления'))
    await act(async () => current().functions.onConfirmRevision())
    await act(async () => current().functions.onRefreshRevision())
    expect(current().states.revisionUnavailable).toBe(true)
    expect(current().states.comment).toBe('Исправить крепления')
    await act(async () => current().functions.onConfirmRevision())
    expect(api.changeStatus).toHaveBeenCalledTimes(1)
  })
  it('не выполняет два изменения при повторном действии до следующего рендера', async () => {
    mount()
    await act(async () => {
      await Promise.all([
        current().functions.onMove(task, 'accepted'),
        current().functions.onMove(task, 'accepted')
      ])
    })
    expect(api.changeStatus).toHaveBeenCalledTimes(1)
  })
})
