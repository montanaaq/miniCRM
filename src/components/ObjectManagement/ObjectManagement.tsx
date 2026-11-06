import type { ConstructionObject } from '@/shared/types/crm.schema'

import DeleteConfirmation from '@/components/DeleteConfirmation/DeleteConfirmation'
import DiscardConfirmation from '@/components/DiscardConfirmation/DiscardConfirmation'
import ObjectEditor from '@/components/ObjectEditor/ObjectEditor'
import { Alert, AlertDescription, Button, Dialog, DialogContent, DialogTrigger } from '@/shared/ui'

import { useObjectManagement } from './useObjectManagement'

const ObjectManagement = ({ object }: { object?: ConstructionObject }) => {
  const { states, functions } = useObjectManagement(object)
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
          <DialogTrigger render={<Button disabled={states.busy} />}>
            {object ? 'Изменить объект' : 'Создать объект'}
          </DialogTrigger>
          {!!object && (
            <Button
              variant="destructive"
              disabled={states.busy}
              onClick={functions.onRequestDelete}
            >
              Удалить объект
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
          <ObjectEditor
            object={states.original}
            busy={states.busy}
            onSave={functions.onSave}
            onCancel={functions.onRequestClose}
            onChange={functions.onChange}
          />
        </DialogContent>
      </div>
    </Dialog>
  )
}
export default ObjectManagement
