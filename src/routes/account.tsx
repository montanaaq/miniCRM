import Account from '@/pages/Account/Account'
import { workspaceOptions } from '@/shared/queries/crm'
import { requireRole } from '@/shared/route-access'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  beforeLoad: ({ context, location }) => ({
    user: requireRole(context.user, 'executor', location.href)
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceOptions(context.user)),
  component: Account
})
