import type { Profile, Task, TaskInput } from '@/shared/types/crm.schema'

import { TASK_INPUT_SCHEMA } from '@/shared/types/crm.schema'
import { useState } from 'react'

export const useTaskEditor = (
  task: Task | undefined,
  profiles: Profile[],
  onSave: (input: TaskInput) => Promise<void>
) => {
  const [error, setError] = useState('')
  const onSubmit = (form: HTMLFormElement) => {
    const input = TASK_INPUT_SCHEMA.safeParse(Object.fromEntries(new FormData(form)))
    if (!input.success) {
      setError('Проверьте обязательные поля: они не должны быть пустыми или состоять из пробелов.')
      return
    }
    setError('')
    void onSave(input.data)
  }

  return {
    states: {
      error,
      title: task ? 'Редактировать задачу' : 'Новая задача',
      executors: profiles.filter(profile => profile.role === 'executor')
    },
    functions: { onSubmit }
  }
}
