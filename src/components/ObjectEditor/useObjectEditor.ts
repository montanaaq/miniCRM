import type { ConstructionObject, ObjectInput } from '@/shared/types/crm.schema'

import { OBJECT_INPUT_SCHEMA } from '@/shared/types/crm.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useObjectEditor = (
  object: ConstructionObject | undefined,
  onSave: (input: ObjectInput) => Promise<void>
) => {
  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(OBJECT_INPUT_SCHEMA)
  })
  const onReset = (object: ConstructionObject | undefined) =>
    reset({ name: object?.name ?? '', address: object?.address ?? '' })

  return {
    states: { title: object ? 'Редактировать объект' : 'Новый объект' },
    forms: {
      register,
      errors: formState.errors,
      isDirty: formState.isDirty,
      onReset,
      onSubmit: handleSubmit(onSave)
    }
  }
}
