import type { useObjectEditor } from './useObjectEditor'

import {
  Button,
  DialogHeader,
  DialogTitle,
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  Input,
  Spinner
} from '@/shared/ui'

interface ObjectEditorProps {
  editor: ReturnType<typeof useObjectEditor>
  busy: boolean
  onCancel: () => void
}
const ObjectEditor = ({ editor, busy, onCancel }: ObjectEditorProps) => {
  const { states, forms } = editor
  return (
    <>
      <DialogHeader>
        <DialogTitle>{states.title}</DialogTitle>
      </DialogHeader>
      <form method="post" className="max-w-2xl" aria-busy={busy} onSubmit={forms.onSubmit}>
        <FieldGroup>
          <Field data-disabled={busy} data-invalid={!!forms.errors.name}>
            <FieldLabel htmlFor="object-name">Название объекта</FieldLabel>
            <Input
              id="object-name"
              {...forms.register('name')}
              aria-invalid={!!forms.errors.name}
              aria-describedby={forms.errors.name ? 'object-name-error' : undefined}
              required
              maxLength={160}
              disabled={busy}
            />
            {forms.errors.name && (
              <FieldError id="object-name-error">Название объекта обязательно.</FieldError>
            )}
          </Field>
          <Field data-disabled={busy} data-invalid={!!forms.errors.address}>
            <FieldLabel htmlFor="object-address">Адрес</FieldLabel>
            <Input
              id="object-address"
              {...forms.register('address')}
              aria-invalid={!!forms.errors.address}
              aria-describedby={forms.errors.address ? 'object-address-error' : undefined}
              autoComplete="street-address"
              required
              maxLength={300}
              disabled={busy}
            />
            {forms.errors.address && (
              <FieldError id="object-address-error">Адрес обязателен.</FieldError>
            )}
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
