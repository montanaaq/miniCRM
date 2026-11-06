import type { ConstructionObject, Profile, Task } from '@/shared/types/crm.schema'

import DeleteConfirmation from '@/components/DeleteConfirmation/DeleteConfirmation'
import DiscardConfirmation from '@/components/DiscardConfirmation/DiscardConfirmation'
import TaskEditor from '@/components/TaskEditor/TaskEditor'
import { Alert, AlertDescription, Button, Dialog, DialogContent, DialogTrigger } from '@/shared/ui'

import { useTaskManagement } from './useTaskManagement'

interface TaskManagementProps {
  task?: Task
  objectId: string
  objects: ConstructionObject[]
  profiles: Profile[]
}
const TaskManagement = ({ task, objectId, objects, profiles }: TaskManagementProps) => {
  const { states, functions, forms } = useTaskManagement(task, objectId, profiles)
  return (
    <Dialog
      open={states.editing}
      disablePointerDismissal
      onOpenChange={(open, details) => {
        if (states.busy) {
          details.cancel()
          return
        }
        if (open) functions.onEdit()
        else if (!functions.onRequestClose()) details.cancel()
      }}
    >
      <div className="mb-6">
        {states.error && !states.editing && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{states.error}</AlertDescription>
          </Alert>
        )}
        <div className="actions mb-4">
          <DialogTrigger
            render={<Button disabled={states.busy || (!task && objects.length === 0)} />}
          >
            {task ? 'Редактировать задачу' : 'Создать задачу'}
          </DialogTrigger>
          {!!task && (
            <Button
              variant="destructive"
              disabled={states.busy}
              onClick={functions.onRequestDelete}
            >
              Удалить задачу
            </Button>
          )}
        </div>
        {states.deleting && (
          <DeleteConfirmation
            busy={states.busy}
            onConfirm={() => void functions.onDelete()}
            onCancel={functions.onCancelDelete}
          />
        )}
        <DialogContent
          className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-2xl"
          showCloseButton={!states.busy}
        >
          {states.error && (
            <Alert variant="destructive">
              <AlertDescription>{states.error}</AlertDescription>
            </Alert>
          )}
          {states.confirmDiscard && !states.busy && (
            <DiscardConfirmation
              onKeepEditing={functions.onKeepEditing}
              onDiscard={functions.onClose}
            />
          )}
          <TaskEditor
            editor={forms.editor}
            objects={objects}
            busy={states.busy}
            onCancel={functions.onRequestClose}
          />
        </DialogContent>
      </div>
    </Dialog>
  )
}
export default TaskManagement
