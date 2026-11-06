// @vitest-environment happy-dom
import type { Profile, Task } from '@/shared/types/crm.schema'

import * as api from '@/lib/api'
import { UserContext } from '@/shared/contexts/user/UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vite-plus/test'

import TaskCard from './TaskCard'

it('требует комментарий для возврата, но позволяет принять задачу без комментария', async () => {
  const manager: Profile = { id: 'manager', name: 'Анна', role: 'manager' }
  const task: Task = {
    id: 'task',
    title: 'Монтаж',
    description: '',
    object_id: 'object',
    assignee_id: 'executor',
    author_id: manager.id,
    status: 'review',
    created_at: '2026-11-05T08:00:00Z',
    version: 1,
    deleted_at: null
  }
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  const client = new QueryClient()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(api, 'loadHistory').mockResolvedValue([])
  const changeStatus = vi.spyOn(api, 'changeStatus').mockResolvedValue(undefined)
  const submit = async (label: string) => {
    const button = [...container.querySelectorAll('button')].find(
      button => button.textContent?.trim() === label
    )
    if (!button) throw new Error(`Кнопка «${label}» недоступна`)
    await act(async () => button.click())
  }

  try {
    await act(async () => {
      root.render(
        createElement(
          QueryClientProvider,
          { client },
          createElement(
            UserContext,
            { value: { user: manager } },
            createElement(TaskCard, {
              task,
              profile: manager,
              profiles: [manager],
              objectName: 'Дом'
            })
          )
        )
      )
    })

    await submit('Вернуть на доработку')
    expect(container.textContent).toContain('Укажите, что нужно исправить.')
    expect(changeStatus).not.toHaveBeenCalled()

    await submit('Принять')
    expect(changeStatus).toHaveBeenCalledExactlyOnceWith(task, 'accepted', '')
  } finally {
    act(() => root.unmount())
    container.remove()
    client.clear()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  }
})
