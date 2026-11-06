import { supabase } from '@/lib/supabase'
import { createAppRouter } from '@/router'
import { userOptions } from '@/shared/queries/user'
import { queryClient } from '@/shared/query-client'
import { useMount } from '@siberiacancode/reactuse'
import { useState } from 'react'

export const useApp = () => {
  const [router] = useState(createAppRouter)
  useMount(() => {
    if (!supabase) return
    let active = true
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') return
      // Supabase callbacks must not await another Auth request under the same lock.
      queueMicrotask(() => {
        if (!active) return
        const current = queryClient.getQueryData(userOptions.queryKey)
        if (event !== 'SIGNED_OUT' && current?.id === session?.user.id && event !== 'USER_UPDATED')
          return
        queryClient.clear()
        void router.invalidate().catch(reportError)
      })
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  })
  return { states: { router } }
}
