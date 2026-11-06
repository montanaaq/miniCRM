import type { QueryClient } from '@tanstack/react-query'

import WorkspacePending from '@/pages/App/WorkspacePending'
import { queryClient } from '@/shared/query-client'
import { createRouter } from '@tanstack/react-router'

import { routeTree } from '../generated/routeTree.gen'

export const createAppRouter = (client: QueryClient = queryClient) =>
  createRouter({
    routeTree,
    context: { queryClient: client },
    defaultPendingComponent: WorkspacePending,
    defaultPendingMs: 150,
    defaultPendingMinMs: 200,
    scrollRestoration: true
  })
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
