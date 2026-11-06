import SignIn from '@/pages/SignIn/SignIn'
import { getHomePath, getReturnHref } from '@/shared/route-access'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/signin')({
  validateSearch: z.object({ returnTo: z.string().optional().catch(undefined) }),
  beforeLoad: ({ context, search }) => {
    if (!context.user) return
    const href = getReturnHref(context.user, search.returnTo)
    if (href) throw redirect({ href, replace: true })
    throw redirect({ to: getHomePath(context.user), replace: true })
  },
  component: SignIn
})
