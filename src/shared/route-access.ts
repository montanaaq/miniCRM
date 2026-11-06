import type { Profile, Role } from '@/shared/types/crm.schema'

import { ROUTES } from '@/shared/constants/routes.const'
import { redirect } from '@tanstack/react-router'

export const getHomePath = (user: Profile | null) =>
  !user ? ROUTES.SIGN_IN : user.role === 'manager' ? ROUTES.ADMIN : ROUTES.ACCOUNT

export const requireRole = (user: Profile | null, role: Role, href: string) => {
  if (!user) throw redirect({ to: ROUTES.SIGN_IN, search: { returnTo: href }, replace: true })
  if (user.role !== role) throw redirect({ to: getHomePath(user), replace: true })
  return user
}

export const getReturnHref = (user: Profile, href?: string) => {
  if (!href?.startsWith('/')) return
  const base = 'https://crm.invalid'
  try {
    const url = new URL(href, base)
    const home = getHomePath(user)
    if (url.origin !== base) return
    if (url.pathname === home || url.pathname.startsWith(home + '/'))
      return url.pathname + url.search + url.hash
  } catch {
    return undefined
  }
}
