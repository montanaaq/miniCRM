import type { Role, Status } from '@/shared/types/crm.schema'

import {
  CircleIcon,
  PlayCircleIcon,
  EyeIcon,
  CheckmarkCircle02Icon,
  RepeatIcon
} from '@hugeicons/core-free-icons'

export const STATUS_ICONS = {
  new: CircleIcon,
  in_progress: PlayCircleIcon,
  review: EyeIcon,
  accepted: CheckmarkCircle02Icon,
  revision: RepeatIcon
} satisfies Record<Status, typeof CircleIcon>

export const STATUS_LABELS: Record<Status, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  review: 'На проверке',
  accepted: 'Принята',
  revision: 'На доработке'
}
export const ACTION_LABELS: Partial<Record<Status, string>> = {
  in_progress: 'Взять в работу',
  review: 'Отправить на проверку',
  accepted: 'Принять',
  revision: 'Вернуть на доработку'
}
export const ROLE_LABELS: Record<Role, string> = { manager: 'Постановщик', executor: 'Исполнитель' }

export const STATUS_VARIANTS: Record<Status, 'outline' | 'secondary' | 'default' | 'destructive'> =
  {
    new: 'outline',
    in_progress: 'secondary',
    review: 'outline',
    accepted: 'default',
    revision: 'destructive'
  }

export const BOARD_STATUSES = [
  'new',
  'in_progress',
  'review',
  'revision',
  'accepted'
] as const satisfies readonly Status[]
