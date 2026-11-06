import type { MouseEvent } from 'react'

import { useThemeContext } from '@/shared/contexts/theme/useThemeContext'
import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons'

export const useThemeToggle = () => {
  const { value, animate } = useThemeContext()
  const isDark = value === 'dark'
  const onToggle = (event: MouseEvent<HTMLButtonElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    const x = event.detail === 0 ? left + width / 2 : event.clientX
    const y = event.detail === 0 ? top + height / 2 : event.clientY
    void animate(x, y, isDark ? 'light' : 'dark').catch(reportError)
  }
  return {
    states: {
      label: isDark ? 'Включить светлую тему' : 'Включить тёмную тему',
      icon: isDark ? Sun03Icon : Moon02Icon
    },
    functions: { onToggle }
  }
}
