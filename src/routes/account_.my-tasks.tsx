import Account from '@/pages/Account/Account'
import { workspaceOptions } from '@/shared/queries/crm'
import { requireRole } from '@/shared/route-access'
import { TASK_LIST_SEARCH_SCHEMA } from '@/shared/types/task-list-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account_/my-tasks')({
  validateSearch: TASK_LIST_SEARCH_SCHEMA,
  beforeLoad: ({ context, location }) => ({
    user: requireRole(context.user, 'executor', location.href)
  }),
  loader: ({ context }) =>
    context.queryClient.query({ ...workspaceOptions(context.user), staleTime: 'static' }),
  component: Account
})
