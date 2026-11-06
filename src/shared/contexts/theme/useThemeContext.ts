import { use } from 'react'

import { ThemeContext } from './ThemeContext'

export const useThemeContext = () => {
  const context = use(ThemeContext)
  if (!context) throw new Error('useThemeContext requires ThemeProvider')
  return context
}
