import type { Theme } from './ThemeContext'

import { THEME_STORAGE_KEY, THEME_TRANSITION_DURATION } from '@/shared/constants/theme.const'
import {
  useLocalStorage,
  useWindowEvent,
  usePreferredDark,
  usePreferredReducedMotion,
  useIsomorphicLayoutEffect,
  useLockCallback
} from '@siberiacancode/reactuse'
import { flushSync } from 'react-dom'

export const useTheme = () => {
  const storage = useLocalStorage<Theme | undefined>(THEME_STORAGE_KEY, undefined, {
    deserializer: value => (value === 'light' || value === 'dark' ? value : undefined)
  })
  useWindowEvent('storage', event => {
    if (event.storageArea === window.localStorage && event.key === null) storage.remove()
  })
  const systemDark = usePreferredDark()
  const reducedMotion = usePreferredReducedMotion()
  const systemTheme = systemDark ? 'dark' : 'light'
  const value = storage.value ?? systemTheme

  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', value === 'dark')
    document.documentElement.classList.toggle('light', value === 'light')
    document
      .querySelector('meta[name="color-scheme"]')
      ?.setAttribute('content', storage.value ?? 'light dark')
  }, [value, storage.value])

  const animate = useLockCallback(async (x: number, y: number, nextTheme: Theme) => {
    await animateThemeChange(
      () => {
        if (nextTheme === systemTheme) storage.remove()
        else storage.set(nextTheme)
      },
      x,
      y,
      reducedMotion === 'reduce'
    )
  })
  return { value, animate }
}

export const animateThemeChange = async (
  update: () => void,
  x: number,
  y: number,
  reducedMotion: boolean
) => {
  if (!document.startViewTransition || reducedMotion) {
    update()
    return
  }
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const transition = document.startViewTransition(() => {
    flushSync(update)
  })
  try {
    await transition.ready
  } catch {
    // A skipped transition still runs the update; only animation setup is skipped.
    await transition.updateCallbackDone
    return
  }
  document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    {
      duration: THEME_TRANSITION_DURATION,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)'
    }
  )
  await transition.finished
}
