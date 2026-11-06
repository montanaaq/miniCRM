import type { Task, TaskInput } from '@/shared/types/crm.schema'

import { useEditDialog } from '@/components/DiscardConfirmation/useEditDialog'
import { deleteTask, saveTask } from '@/lib/api'
import { ROUTES } from '@/shared/constants/routes.const'
import { useCrmMutation } from '@/shared/queries/useCrmMutation'
import { useBoolean } from '@siberiacancode/reactuse'
import { useNavigate } from '@tanstack/react-router'

export const useTaskManagement = (task?: Task) => {
  const editor = useEditDialog(task)
  const [deleting, setDeleting] = useBoolean(false)
  const { states: crmMutation, functions: crmMutationFunctions } = useCrmMutation()
  const navigate = useNavigate()
  const onSave = (input: TaskInput) =>
    crmMutationFunctions.onRun(
      () => saveTask(input, editor.states.original),
      editor.functions.onClose
    )
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
