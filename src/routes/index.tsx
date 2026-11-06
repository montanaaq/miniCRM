import { getHomePath } from '@/shared/route-access'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    throw redirect({ to: getHomePath(context.user), replace: true })
  }
})
