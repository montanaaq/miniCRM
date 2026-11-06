import { Alert, AlertDescription, Button } from '@/shared/ui'

const DiscardConfirmation = ({
  onKeepEditing,
  onDiscard
}: {
  onKeepEditing: () => void
  onDiscard: () => void
}) => (
  <Alert>
    <AlertDescription>Закрыть форму и потерять несохранённые изменения?</AlertDescription>
    <div className="actions mt-4">
      <Button variant="outline" onClick={onKeepEditing}>
        Продолжить редактирование
      </Button>
      <Button variant="destructive" onClick={onDiscard}>
        Отбросить изменения
      </Button>
    </div>
  </Alert>
)
export default DiscardConfirmation
