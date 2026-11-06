import type { ReactNode } from 'react'

import { queryClient } from '@/shared/query-client'
import { QueryClientProvider } from '@tanstack/react-query'

import ThemeProvider from './theme/ThemeProvider'

const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>{children}</ThemeProvider>
  </QueryClientProvider>
)
export default AppProviders
