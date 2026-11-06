import type { Status } from '@/shared/types/crm.schema'

import { STATUS_ICONS, STATUS_LABELS, STATUS_VARIANTS } from '@/shared/constants/task.const'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from './badge'

const TaskStatus = ({ status }: { status: Status }) => (
  <Badge variant={STATUS_VARIANTS[status]}>
    <HugeiconsIcon icon={STATUS_ICONS[status]} aria-hidden="true" />
    {STATUS_LABELS[status]}
  </Badge>
)
export default TaskStatus
