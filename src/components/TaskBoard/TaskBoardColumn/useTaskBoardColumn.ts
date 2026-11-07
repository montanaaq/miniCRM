import type { Status } from '@/shared/types/crm.schema'

import { useDroppable } from '@dnd-kit/core'
import { useId } from 'react'

export const useTaskBoardColumn = (status: Status, enabled: boolean) => {
  const { isOver, setNodeRef } = useDroppable({ id: status, disabled: !enabled })
  return { states: { isOver, titleId: useId() }, functions: { onNodeRef: setNodeRef } }
}
