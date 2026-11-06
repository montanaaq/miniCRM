import type { ConstructionObject, ObjectInput } from '@/shared/types/crm.schema'

import {
  Alert,
  AlertDescription,
  Button,
  DialogHeader,
  DialogTitle,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner
} from '@/shared/ui'

import { useObjectEditor } from './useObjectEditor'

interface ObjectEditorProps {
  object?: ConstructionObject
  busy: boolean
  onSave: (input: ObjectInput) => Promise<void>
  onCancel: () => void
  onChange: () => void
}
const ObjectEditor = ({ object, busy, onSave, onCancel, onChange }: ObjectEditorProps) => {
  const { states, functions } = useObjectEditor(object, onSave)
  return (
    <>
      <DialogHeader>
        <DialogTitle>{states.title}</DialogTitle>
      </DialogHeader>
      <form
        method="post"
        className="max-w-2xl"
        aria-busy={busy}
        onChange={onChange}
        onSubmit={event => {
          event.preventDefault()
          functions.onSubmit(event.currentTarget)
        }}
      >
        <FieldGroup>
          {!!states.error && (
            <Alert variant="destructive">
              <AlertDescription>{states.error}</AlertDescription>
            </Alert>
          )}
          <Field data-disabled={busy}>
            <FieldLabel htmlFor="object-name">Название объекта</FieldLabel>
            <Input
              id="object-name"
              name="name"
              defaultValue={object?.name}
              required
              maxLength={160}
              disabled={busy}
            />
          </Field>
          <Field data-disabled={busy}>
            <FieldLabel htmlFor="object-address">Адрес</FieldLabel>
            <Input
              id="object-address"
              name="address"
              autoComplete="street-address"
              defaultValue={object?.address}
              required
              maxLength={300}
              disabled={busy}
            />
          </Field>
          <Field orientation="horizontal">
            <Button type="submit" disabled={busy}>
              {busy && <Spinner data-icon="inline-start" aria-label="Сохраняем объект" />}
              Сохранить
            </Button>
            <Button variant="outline" type="button" onClick={onCancel} disabled={busy}>
              Отмена
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  )
}
export default ObjectEditor
