import App from '@/pages/App/App'
import AppProviders from '@/shared/contexts/AppProviders'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
)
