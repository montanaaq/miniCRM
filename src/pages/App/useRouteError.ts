import { getErrorMessage, signOut } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

export const useRouteError = (error: unknown) => {
  const router = useRouter()
  const signOutMutation = useMutation({ mutationFn: signOut })
  return {
    states: {
      error: getErrorMessage(signOutMutation.error ?? error),
      busy: signOutMutation.isPending
    },
    functions: {
      onRetry: () => void router.invalidate().catch(reportError),
      onSignOut: () => signOutMutation.mutate()
    }
  }
}
