import Admin from '@/pages/Admin/Admin'
import { workspaceOptions } from '@/shared/queries/crm'
import { requireRole } from '@/shared/route-access'
import { TASK_DETAIL_SEARCH_SCHEMA } from '@/shared/types/task-list-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin_/tasks_/$taskId')({
  validateSearch: TASK_DETAIL_SEARCH_SCHEMA,
  beforeLoad: ({ context, location }) => ({
    user: requireRole(context.user, 'manager', location.href)
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceOptions(context.user)),
  component: Admin
})
