import type { Profile, Task, TaskInput } from '@/shared/types/crm.schema'

import { TASK_INPUT_SCHEMA } from '@/shared/types/crm.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useTaskEditor = (
  task: Task | undefined,
  objectId: string,
  profiles: Profile[],
  onSave: (input: TaskInput) => Promise<void>
) => {
  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(TASK_INPUT_SCHEMA)
  })
  const onReset = (task: Task | undefined) =>
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      object_id: task?.object_id ?? objectId,
      assignee_id: task?.assignee_id ?? ''
    })

  return {
    states: {
      title: task ? 'Редактировать задачу' : 'Новая задача',
      executors: profiles.filter(profile => profile.role === 'executor')
    },
    forms: {
      register,
      errors: formState.errors,
      isDirty: formState.isDirty,
      onReset,
      onSubmit: handleSubmit(onSave)
    }
  }
}
