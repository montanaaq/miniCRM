import type { ConstructionObject, ObjectInput } from '@/shared/types/crm.schema'

import { OBJECT_INPUT_SCHEMA } from '@/shared/types/crm.schema'
import { useState } from 'react'

export const useObjectEditor = (
  object: ConstructionObject | undefined,
  onSave: (input: ObjectInput) => Promise<void>
) => {
  const [error, setError] = useState('')
  const onSubmit = (form: HTMLFormElement) => {
    const input = OBJECT_INPUT_SCHEMA.safeParse(Object.fromEntries(new FormData(form)))
    if (!input.success) {
      setError('Проверьте обязательные поля: они не должны быть пустыми или состоять из пробелов.')
      return
    }
    setError('')
    void onSave(input.data)
  }

  return {
    states: { error, title: object ? 'Редактировать объект' : 'Новый объект' },
    functions: { onSubmit }
  }
}
