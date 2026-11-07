import { supabase } from '@/lib/supabase'
import { createAppRouter } from '@/router'
import { userOptions } from '@/shared/queries/user'
import { queryClient } from '@/shared/query-client'
import { useMount } from '@siberiacancode/reactuse'
import { RouterProvider } from '@tanstack/react-router'
import { useState } from 'react'

const App = () => {
  const [router] = useState(createAppRouter)
  useMount(() => {
    if (!supabase) return
    let active = true
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') return
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
  if (!supabase)
    return (
      <main className="setup">
        <h1>Подключите Supabase</h1>
        <p>Заполните VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY в .env.local.</p>
      </main>
    )
  return <RouterProvider router={router} />
}
export default App
