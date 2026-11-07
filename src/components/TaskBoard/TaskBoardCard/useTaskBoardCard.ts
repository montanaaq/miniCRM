import type { Status, Task } from '@/shared/types/crm.schema'

import { getAvailableActions } from '@/lib/tasks'
import { useUser } from '@/shared/contexts/user/useUser'
import { STATUS_SCHEMA } from '@/shared/types/crm.schema'
import { useDraggable } from '@dnd-kit/core'
import { useId } from 'react'

export const useTaskBoardCard = (
  task: Task,
  busy: boolean,
  onMove: (task: Task, status: Status) => void
) => {
  const { user } = useUser()
  const actions = user ? getAvailableActions(task, user) : []
  const { attributes, listeners, isDragging, setNodeRef, setActivatorNodeRef } = useDraggable({
    id: task.id,
    disabled: busy || !actions.length
  })
  const id = useId()
  return {
    states: { actions, attributes, listeners, isDragging, id },
    functions: {
      onNodeRef: setNodeRef,
      onActivatorRef: setActivatorNodeRef,
      onSelect: (value: string) => {
        const status = STATUS_SCHEMA.safeParse(value)
        if (status.success) onMove(task, status.data)
      }
    }
  }
}
