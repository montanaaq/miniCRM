import type { ReactNode } from 'react'

import { ThemeContext } from './ThemeContext'
import { useTheme } from './useTheme'

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme()
  return <ThemeContext value={theme}>{children}</ThemeContext>
}
export default ThemeProvider
