import type { Profile, Status, Task } from '@/shared/types/crm.schema'

import { changeStatus, getErrorMessage } from '@/lib/api'
import { formatDate, getAvailableActions } from '@/lib/tasks'
import { historyOptions } from '@/shared/queries/crm'
import { useCrmMutation } from '@/shared/queries/useCrmMutation'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

export interface TaskCardProps {
  task: Task
  profile: Profile
  profiles: Profile[]
  objectName: string
}
export const useTaskCard = ({ task, profile, profiles }: TaskCardProps) => {
  const historyQuery = useQuery(historyOptions(profile, task.id))
  const { states: crmMutation, functions: crmMutationFunctions } = useCrmMutation()
  const { register, handleSubmit, reset, setValue, formState } = useForm<{
    comment: string
    status: Status | null
  }>({ defaultValues: { comment: '', status: null } })
  const actions = getAvailableActions(task, profile)
  const onSubmit = handleSubmit(({ status, comment }) => {
    if (!status || !actions.includes(status)) return
    return crmMutationFunctions.onRun(() => changeStatus(task, status, comment), reset)
  })
  const getProfileName = (id: string, fallback = 'Пользователь') =>
    profiles.find(person => person.id === id)?.name ?? fallback

  return {
    states: {
      ...crmMutation,
      loading: historyQuery.isPending,
      historyError: historyQuery.isError ? getErrorMessage(historyQuery.error) : '',
      actions,
      entries: historyQuery.data ?? [],
      assignee: getProfileName(task.assignee_id, 'Исполнитель'),
      author: getProfileName(task.author_id, 'Постановщик'),
      createdAt: formatDate(task.created_at)
    },
    forms: {
      comment: register('comment', {
        validate: (value, { status }) =>
          status !== 'revision' || !!value.trim() || 'Укажите, что нужно исправить.'
      }),
      commentError: formState.errors.comment?.message,
      onSelectStatus: (status: Status) => setValue('status', status),
      onSubmit
    },
    functions: {
      getProfileName,
      formatDate,
      onRetry: () => void historyQuery.refetch()
    }
  }
}
