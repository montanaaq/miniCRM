import type { Profile } from '@/shared/types/crm.schema'

import { loadHistory, loadWorkspace } from '@/lib/api'
import { queryOptions } from '@tanstack/react-query'

export const workspaceOptions = (user: Profile) =>
  queryOptions({
    queryKey: ['crm', user.id, user.role, 'workspace'],
    queryFn: loadWorkspace
  })

export const historyOptions = (user: Profile, taskId: string) =>
  queryOptions({
    queryKey: ['crm', user.id, user.role, 'history', taskId],
    queryFn: () => loadHistory(taskId)
  })
