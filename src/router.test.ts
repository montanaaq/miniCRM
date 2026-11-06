import type { Profile } from '@/shared/types/crm.schema'

import { workspaceOptions } from '@/shared/queries/crm'
import { userOptions } from '@/shared/queries/user'
// @vitest-environment happy-dom
import { QueryClient } from '@tanstack/react-query'
import { createMemoryHistory } from '@tanstack/react-router'
import { describe, expect, it } from 'vite-plus/test'

import { createAppRouter } from './router'

const manager: Profile = { id: 'manager', name: 'Анна', role: 'manager' }
const executor: Profile = { id: 'executor', name: 'Иван', role: 'executor' }

const setupRouter = (path: string, user: Profile | null) => {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } }
  })
  client.setQueryData(userOptions.queryKey, user)
  if (user)
    client.setQueryData(workspaceOptions(user).queryKey, {
      profiles: [user],
      objects: [],
      tasks: []
    })
  const router = createAppRouter(client)
  router.update({
    ...router.options,
    history: createMemoryHistory({ initialEntries: [path] }),
    isServer: false
  })
  return { client, router }
}

describe('Маршруты CRM', () => {
  ;[
    { user: null, path: '/', expected: '/signin' },
    { user: manager, path: '/', expected: '/admin' },
    { user: executor, path: '/', expected: '/account' },
    { user: null, path: '/admin', expected: '/signin' },
    { user: null, path: '/admin/tasks', expected: '/signin' },
    { user: executor, path: '/admin/tasks', expected: '/account' },
    { user: manager, path: '/admin/tasks', expected: '/admin/tasks' },
    { user: null, path: '/account/tasks/task-1', expected: '/signin' },
    { user: executor, path: '/admin/objects/object-1', expected: '/account' },
    { user: executor, path: '/admin/tasks/task-1', expected: '/account' },
    { user: manager, path: '/account/my-tasks', expected: '/admin' },
    { user: manager, path: '/account/tasks/task-1', expected: '/admin' },
    { user: manager, path: '/account/objects/object-1', expected: '/admin' },
    { user: manager, path: '/signin', expected: '/admin' },
    { user: manager, path: '/admin/tasks/task-1', expected: '/admin/tasks/task-1' },
    { user: executor, path: '/account/objects/object-1', expected: '/account/objects/object-1' }
  ].forEach(({ user, path, expected }) => {
    it(`открывает ${expected} при запросе ${path} от ${user?.role ?? 'гостя'}`, async () => {
      const { client, router } = setupRouter(path, user)
      await router.load()
      expect(router.state.location.pathname).toBe(expected)
      expect(router.state.matches.length).toBeGreaterThan(0)
      expect(router.state.matches.every(match => match.status === 'success')).toBe(true)
      client.clear()
    })
  })
})

describe('Возврат после входа', () => {
  it.each([
    [manager, '/admin/tasks/task-1?view=table&status=review#history'],
    [executor, '/account/objects/object-1?view=table&search=doors']
  ] as const)('открывает исходную ссылку для %j', async (user, href) => {
    const { client, router } = setupRouter(href, null)
    await router.load()
    expect(router.state.location.pathname).toBe('/signin')
    expect(router.state.location.search).toEqual({ returnTo: href })

    client.setQueryData(userOptions.queryKey, user)
    client.setQueryData(workspaceOptions(user).queryKey, {
      profiles: [user],
      objects: [],
      tasks: []
    })
    await router.invalidate()
    expect(router.state.location.href).toBe(href)
    client.clear()
  })

  it.each([
    'https://external.example/admin',
    '//external.example/admin',
    '/\\external.example/admin',
    '/admin/../account/tasks/task-1',
    '/account/tasks/task-1'
  ])('отправляет на главную менеджера при returnTo=%s', async href => {
    const { client, router } = setupRouter('/signin?returnTo=' + encodeURIComponent(href), manager)
    await router.load()
    expect(router.state.location.href).toBe('/admin')
    client.clear()
  })
})
