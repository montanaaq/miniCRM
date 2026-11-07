import type { ConstructionObject, ObjectInput } from '@/shared/types/crm.schema'

import { useEditDialog } from '@/components/DiscardConfirmation/useEditDialog'
import { useObjectEditor } from '@/components/ObjectEditor/useObjectEditor'
import { deleteObject, saveObject } from '@/lib/api'
import { ROUTES } from '@/shared/constants/routes.const'
import { useCrmMutation } from '@/shared/queries/useCrmMutation'
import { useBoolean } from '@siberiacancode/reactuse'
import { useNavigate } from '@tanstack/react-router'

export const useObjectManagement = (object?: ConstructionObject) => {
  const dialog = useEditDialog(object)
  const [deleting, setDeleting] = useBoolean(false)
  const { states: crmMutation, functions: crmMutationFunctions } = useCrmMutation()
  const navigate = useNavigate()
  const onSave = (input: ObjectInput) =>
    crmMutationFunctions.onRun(
      () => saveObject(input, dialog.states.original),
      dialog.functions.onClose
    )
  const editor = useObjectEditor(dialog.states.original, onSave)
  const onDelete = () => {
    if (!object) return
    return crmMutationFunctions.onRun(
      () => deleteObject(object),
      () => {
        void navigate({ to: ROUTES.ADMIN })
      }
    )
  }
  return {
    forms: { editor },
    states: { ...crmMutation, ...dialog.states, deleting },
    functions: {
      ...dialog.functions,
      onRequestClose: () => dialog.functions.onRequestClose(editor.forms.isDirty),
      onDelete,
      onEdit: () => {
        crmMutationFunctions.onReset()
        editor.forms.onReset(object)
        dialog.functions.onOpen()
      },
      onRequestDelete: () => setDeleting(true),
      onCancelDelete: () => setDeleting(false)
    }
  }
}
