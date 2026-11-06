import type { ConstructionObject, ObjectInput } from '@/shared/types/crm.schema'

import { useEditDialog } from '@/components/DiscardConfirmation/useEditDialog'
import { deleteObject, saveObject } from '@/lib/api'
import { ROUTES } from '@/shared/constants/routes.const'
import { useCrmMutation } from '@/shared/queries/useCrmMutation'
import { useBoolean } from '@siberiacancode/reactuse'
import { useNavigate } from '@tanstack/react-router'

export const useObjectManagement = (object?: ConstructionObject) => {
  const editor = useEditDialog(object)
  const [deleting, setDeleting] = useBoolean(false)
  const { states: crmMutation, functions: crmMutationFunctions } = useCrmMutation()
  const navigate = useNavigate()
  const onSave = (input: ObjectInput) =>
    crmMutationFunctions.onRun(
      () => saveObject(input, editor.states.original),
      editor.functions.onClose
    )
  const onDelete = () => {
    if (!object) return
    return crmMutationFunctions.onRun(
      () => deleteObject(object.id),
      () => {
        void navigate({ to: ROUTES.ADMIN })
      }
    )
  }
  return {
    states: { ...crmMutation, ...editor.states, deleting },
    functions: {
      ...editor.functions,
      onSave,
      onDelete,
      onEdit: () => {
        crmMutationFunctions.onReset()
        editor.functions.onOpen()
      },
      onRequestDelete: () => setDeleting(true),
      onCancelDelete: () => setDeleting(false)
    }
  }
}
