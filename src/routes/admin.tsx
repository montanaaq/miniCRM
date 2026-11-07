import Admin from '@/pages/Admin/Admin'
import { workspaceOptions } from '@/shared/queries/crm'
import { requireRole } from '@/shared/route-access'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context, location }) => ({
    user: requireRole(context.user, 'manager', location.href)
  }),
  loader: ({ context }) =>
    context.queryClient.query({ ...workspaceOptions(context.user), staleTime: 'static' }),
  component: Admin
})
