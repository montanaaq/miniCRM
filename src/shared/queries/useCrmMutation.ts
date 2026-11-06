import { getErrorMessage } from '@/lib/api'
import { useUser } from '@/shared/contexts/user/useUser'
import { useLockCallback } from '@siberiacancode/reactuse'
import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'

export const useCrmMutation = () => {
  const { user } = useUser()
  const client = useQueryClient()
  const mutationKey = ['crm', user?.id]
  const pendingCount = useIsMutating({ mutationKey })
  const crmMutation = useMutation({
    mutationKey,
    mutationFn: (operation: () => Promise<void>) => operation(),
    onSuccess: () => client.invalidateQueries({ queryKey: ['crm', user?.id] })
  })
  const onRun = useLockCallback(async (operation: () => Promise<void>, onSuccess?: () => void) => {
    try {
      await crmMutation.mutateAsync(operation)
    } catch {
      return
    }
    onSuccess?.()
  })
  return {
    states: {
      busy: pendingCount > 0,
      statusConflict:
        crmMutation.error !== null &&
        typeof crmMutation.error === 'object' &&
        'code' in crmMutation.error &&
        crmMutation.error.code === '40001',
      error: crmMutation.isError ? getErrorMessage(crmMutation.error) : ''
    },
    functions: { onRun, onReset: crmMutation.reset }
  }
}
