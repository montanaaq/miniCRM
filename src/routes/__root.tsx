import type { QueryClient } from '@tanstack/react-query'

import RouteError from '@/pages/App/RouteError'
import { ROUTES } from '@/shared/constants/routes.const'
import UserProvider from '@/shared/contexts/user/UserProvider'
import { userOptions } from '@/shared/queries/user'
import { buttonVariants } from '@/shared/ui'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'

const Root = () => {
  const { user } = Route.useRouteContext()
  return (
    <UserProvider user={user}>
      <Outlet />
    </UserProvider>
  )
}
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ context }) => ({ user: await context.queryClient.query(userOptions) }),
  component: Root,
  notFoundComponent: () => (
    <main className="setup">
      <h1>Страница не найдена</h1>
      <Link to={ROUTES.ROOT} className={buttonVariants({ variant: 'link' })}>
        На главную
      </Link>
    </main>
  ),
  errorComponent: RouteError
})
