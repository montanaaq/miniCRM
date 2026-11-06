import { Button } from '@/shared/ui'
import { HugeiconsIcon } from '@hugeicons/react'

import { useThemeToggle } from './useThemeToggle'

const ThemeToggle = () => {
  const { states, functions } = useThemeToggle()
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={states.label}
      title={states.label}
      onClick={functions.onToggle}
    >
      <HugeiconsIcon icon={states.icon} aria-hidden="true" />
    </Button>
  )
}
export default ThemeToggle
