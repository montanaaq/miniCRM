import { createContext } from 'react'

export type Theme = 'light' | 'dark'
export interface ThemeContextValue {
  value: Theme
  animate: (x: number, y: number, nextTheme: Theme) => Promise<void>
}
export const ThemeContext = createContext<ThemeContextValue | null>(null)
