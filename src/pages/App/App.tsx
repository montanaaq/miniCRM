import { supabase } from '@/lib/supabase'
import { RouterProvider } from '@tanstack/react-router'

import { useApp } from './useApp'

const App = () => {
  const { states } = useApp()
  if (!supabase)
    return (
      <main className="setup">
        <h1>Подключите Supabase</h1>
        <p>Заполните VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY в .env.local.</p>
      </main>
    )
  return <RouterProvider router={states.router} />
}
export default App
