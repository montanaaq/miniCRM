import type { WorkspaceHome } from '@/shared/types/routes.types'

import { getErrorMessage, signOut } from '@/lib/api'
import { WORKSPACE_ROUTES } from '@/shared/constants/routes.const'
import { useUser } from '@/shared/contexts/user/useUser'
import { TASK_LIST_SEARCH_SCHEMA } from '@/shared/types/task-list-search'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useMatchRoute, useSearch } from '@tanstack/react-router'

export const useWorkspaceLayout = (home: WorkspaceHome) => {
  const { user } = useUser()
  const location = useLocation()
  const matchRoute = useMatchRoute()
  const search = useSearch({ strict: false })
  const tasksPath = WORKSPACE_ROUTES[home].tasks
  const isTasks =
    location.pathname.replace(/\/+$/, '') === tasksPath ||
    !!matchRoute({ to: WORKSPACE_ROUTES[home].task })
  const client = useQueryClient()
  const signOutMutation = useMutation({ mutationFn: signOut })
  return {
    states: {
      user,
      tasksPath,
      tasksSearch: isTasks && !search.fromObject ? TASK_LIST_SEARCH_SCHEMA.parse(search) : {},
      isTasks,
      busy: signOutMutation.isPending,
      error: signOutMutation.isError ? getErrorMessage(signOutMutation.error) : ''
    },
    functions: {
      onSignOut: () => signOutMutation.mutate(),
      onRefresh: () => void client.invalidateQueries({ queryKey: ['crm', user?.id] })
    }
  }
}
