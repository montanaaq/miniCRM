import { Alert, AlertTitle, AlertDescription, Button, Spinner } from '@/shared/ui'

interface DeleteConfirmationProps {
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}
const DeleteConfirmation = ({ busy, onConfirm, onCancel }: DeleteConfirmationProps) => (
  <Alert className="mb-6">
    <AlertTitle>Подтвердите удаление</AlertTitle>
    <AlertDescription>
      Запись исчезнет из рабочих списков. История задач сохранится. Для удаления объекта сначала
      удалите его задачи.
    </AlertDescription>
    <div className="actions mt-4">
      <Button variant="destructive" disabled={busy} onClick={onConfirm}>
        {busy && <Spinner data-icon="inline-start" aria-label="Удаляем запись" />}Подтвердить
        удаление
      </Button>
      <Button variant="outline" disabled={busy} onClick={onCancel}>
        Отмена
      </Button>
    </div>
  </Alert>
)
export default DeleteConfirmation
