import type { Profile, Status, Task } from '@/shared/types/crm.schema'

import { changeStatus, getErrorMessage } from '@/lib/api'
import { formatDate, getAvailableActions } from '@/lib/tasks'
import { historyOptions } from '@/shared/queries/crm'
import { useCrmMutation } from '@/shared/queries/useCrmMutation'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export interface TaskCardProps {
  task: Task
  profile: Profile
  profiles: Profile[]
  objectName: string
}
export const useTaskCard = ({ task, profile, profiles }: TaskCardProps) => {
  const historyQuery = useQuery(historyOptions(profile, task.id))
  const { states: crmMutation, functions: crmMutationFunctions } = useCrmMutation()
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const actions = getAvailableActions(task, profile)
  const onTransition = (status: Status) => {
    if (status === 'revision' && !comment.trim()) {
      setCommentError('Укажите, что нужно исправить.')
      return
    }
    setCommentError('')
    void crmMutationFunctions.onRun(
      () => changeStatus(task, status, comment),
      () => setComment('')
    )
  }
  const getProfileName = (id: string, fallback = 'Пользователь') =>
    profiles.find(person => person.id === id)?.name ?? fallback

  return {
    states: {
      ...crmMutation,
      loading: historyQuery.isPending,
      historyError: historyQuery.isError ? getErrorMessage(historyQuery.error) : '',
      comment,
      commentError,
      actions,
      entries: historyQuery.data ?? [],
      assignee: getProfileName(task.assignee_id, 'Исполнитель'),
      author: getProfileName(task.author_id, 'Постановщик'),
      createdAt: formatDate(task.created_at)
    },
    functions: {
      getProfileName,
      formatDate,
      onTransition,
      onCommentChange: setComment,
      onRetry: () => void historyQuery.refetch()
    }
  }
}
