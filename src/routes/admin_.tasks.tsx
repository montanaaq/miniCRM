import Admin from '@/pages/Admin/Admin'
import { workspaceOptions } from '@/shared/queries/crm'
import { requireRole } from '@/shared/route-access'
import { TASK_LIST_SEARCH_SCHEMA } from '@/shared/types/task-list-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin_/tasks')({
  validateSearch: TASK_LIST_SEARCH_SCHEMA,
  beforeLoad: ({ context, location }) => ({
    user: requireRole(context.user, 'manager', location.href)
  }),
  loader: ({ context }) =>
    context.queryClient.query({ ...workspaceOptions(context.user), staleTime: 'static' }),
  component: Admin
})
