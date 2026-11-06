import type { TaskListRow } from '@/components/TaskList/useTaskList'
import type { Status, Task } from '@/shared/types/crm.schema'
import type { UniqueIdentifier } from '@dnd-kit/core'

import { changeStatus, getErrorMessage } from '@/lib/api'
import { getAvailableActions } from '@/lib/tasks'
import { STATUS_LABELS } from '@/shared/constants/task.const'
import { useUser } from '@/shared/contexts/user/useUser'
import { workspaceOptions } from '@/shared/queries/crm'
import { useCrmMutation } from '@/shared/queries/useCrmMutation'
import { STATUS_SCHEMA } from '@/shared/types/crm.schema'
import { KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useTaskBoard = (rows: TaskListRow[]) => {
  const { user } = useUser()
  if (!user) throw new Error('Task board requires an authenticated user')
  const { states: crmMutation, functions: crmMutationFunctions } = useCrmMutation()
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [revisionTask, setRevisionTask] = useState<Task | null>(null)
  const [revisionUnavailable, setRevisionUnavailable] = useState(false)
  const queryClient = useQueryClient()
  const revisionRefreshMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const workspace = await queryClient.fetchQuery({ ...workspaceOptions(user), staleTime: 0 })
      return workspace.tasks.find(task => task.id === taskId)
    },
    onSuccess: task => {
      const available = !!task && getAvailableActions(task, user).includes('revision')
      setRevisionUnavailable(!available)
      if (available) setRevisionTask(task)
      crmMutationFunctions.onReset()
    }
  })
  const busy = crmMutation.busy || revisionRefreshMutation.isPending
  const revisionBlocked = crmMutation.statusConflict || revisionUnavailable
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: { comment: '' }
  })
  const [announcement, setAnnouncement] = useState('')
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  )
  const onMove = (task: Task, status: Status) => {
    if (crmMutation.busy || revisionTask || !getAvailableActions(task, user).includes(status))
      return
    crmMutationFunctions.onReset()
    setAnnouncement('')
    if (status === 'revision') {
      reset()
      revisionRefreshMutation.reset()
      setRevisionUnavailable(false)
      setRevisionTask(task)
      return
    }
    return crmMutationFunctions.onRun(
      () => changeStatus(task, status, ''),
      () => {
        setAnnouncement(`Задача «${task.title}»: ${STATUS_LABELS[status]}.`)
      }
    )
  }
  const onConfirmRevision = handleSubmit(({ comment }) => {
    if (!revisionTask || busy || revisionBlocked) return
    return crmMutationFunctions.onRun(
      () => changeStatus(revisionTask, 'revision', comment),
      () => {
        setAnnouncement(`Задача «${revisionTask.title}» возвращена на доработку.`)
        setRevisionTask(null)
      }
    )
  })
  const onDragStart = (id: UniqueIdentifier) => {
    const task = rows.find(row => row.task.id === id)?.task
    if (!task || crmMutation.busy || !getAvailableActions(task, user).length) return
    setDraggedTask(task)
  }
  const onDragEnd = (id: UniqueIdentifier | null) => {
    const status = STATUS_SCHEMA.safeParse(id)
    if (draggedTask && status.success) void onMove(draggedTask, status.data)
    setDraggedTask(null)
  }
  return {
    states: {
      ...crmMutation,
      busy,
      revisionBlocked,
      revisionUnavailable,
      revisionRefreshError: revisionRefreshMutation.isError
        ? getErrorMessage(revisionRefreshMutation.error)
        : '',
      sensors,
      draggedTask,
      revisionTask,
      announcement,
      targets: draggedTask ? getAvailableActions(draggedTask, user) : []
    },
    forms: {
      comment: register('comment', {
        validate: value => !!value.trim() || 'Укажите, что нужно исправить.'
      }),
      commentError: formState.errors.comment?.message,
      onConfirmRevision
    },
    functions: {
      onMove,
      onDragStart,
      onDragEnd,
      onDragCancel: () => setDraggedTask(null),
      onRefreshRevision: () => {
        if (!revisionTask || busy) return
        return revisionRefreshMutation.mutateAsync(revisionTask.id).catch(() => {
          // The modal renders the refresh error.
        })
      },
      onCancelRevision: () => {
        if (!busy) setRevisionTask(null)
      }
    }
  }
}
