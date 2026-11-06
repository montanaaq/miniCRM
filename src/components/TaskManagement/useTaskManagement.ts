import type { Profile, Task, TaskInput } from '@/shared/types/crm.schema'

import { useEditDialog } from '@/components/DiscardConfirmation/useEditDialog'
import { useTaskEditor } from '@/components/TaskEditor/useTaskEditor'
import { deleteTask, saveTask } from '@/lib/api'
import { ROUTES } from '@/shared/constants/routes.const'
import { useCrmMutation } from '@/shared/queries/useCrmMutation'
import { useBoolean } from '@siberiacancode/reactuse'
import { useNavigate } from '@tanstack/react-router'

export const useTaskManagement = (
  task: Task | undefined,
  objectId: string,
  profiles: Profile[]
) => {
  const dialog = useEditDialog(task)
  const [deleting, setDeleting] = useBoolean(false)
  const { states: crmMutation, functions: crmMutationFunctions } = useCrmMutation()
  const navigate = useNavigate()
  const onSave = (input: TaskInput) =>
    crmMutationFunctions.onRun(
      () => saveTask(input, dialog.states.original),
      dialog.functions.onClose
    )
  const editor = useTaskEditor(dialog.states.original, objectId, profiles, onSave)
  const onDelete = () => {
    if (!task) return
    return crmMutationFunctions.onRun(
      () => deleteTask(task.id),
      () => {
        void navigate({ to: ROUTES.ADMIN_OBJECT, params: { objectId: task.object_id } })
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
        editor.forms.onReset(task)
        dialog.functions.onOpen()
      },
      onRequestDelete: () => setDeleting(true),
      onCancelDelete: () => setDeleting(false)
    }
  }
}
