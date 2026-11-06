import type { FileRoutesByTo } from '../../../generated/routeTree.gen'

export const ROUTES = {
  ROOT: '/',
  SIGN_IN: '/signin',
  ADMIN: '/admin',
  ALL_TASKS: '/admin/tasks',
  ADMIN_OBJECT: '/admin/objects/$objectId',
  ADMIN_TASK: '/admin/tasks/$taskId',
  ACCOUNT: '/account',
  ACCOUNT_OBJECT: '/account/objects/$objectId',
  ACCOUNT_TASK: '/account/tasks/$taskId',
  MY_TASKS: '/account/my-tasks'
} as const satisfies Record<string, keyof FileRoutesByTo>

export const WORKSPACE_ROUTES = {
  [ROUTES.ADMIN]: { object: ROUTES.ADMIN_OBJECT, task: ROUTES.ADMIN_TASK, tasks: ROUTES.ALL_TASKS },
  [ROUTES.ACCOUNT]: {
    object: ROUTES.ACCOUNT_OBJECT,
    task: ROUTES.ACCOUNT_TASK,
    tasks: ROUTES.MY_TASKS
  }
} as const
