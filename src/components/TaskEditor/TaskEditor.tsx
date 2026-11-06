import type { useTaskEditor } from './useTaskEditor'
import type { ConstructionObject } from '@/shared/types/crm.schema'

import {
  Alert,
  AlertDescription,
  Button,
  DialogHeader,
  DialogTitle,
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  Input,
  NativeSelect,
  NativeSelectOption,
  Spinner,
  Textarea
} from '@/shared/ui'

interface TaskEditorProps {
  editor: ReturnType<typeof useTaskEditor>
  objects: ConstructionObject[]
  busy: boolean
  onCancel: () => void
}
const TaskEditor = ({ editor, objects, busy, onCancel }: TaskEditorProps) => {
  const { states, forms } = editor
  return (
    <>
      <DialogHeader>
        <DialogTitle>{states.title}</DialogTitle>
      </DialogHeader>
      <form method="post" className="max-w-2xl" aria-busy={busy} onSubmit={forms.onSubmit}>
        <FieldGroup>
          {states.executors.length === 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Нет исполнителей. Обратитесь к администратору, чтобы добавить сотрудника.
              </AlertDescription>
            </Alert>
          )}
          <Field data-disabled={busy} data-invalid={!!forms.errors.title}>
            <FieldLabel htmlFor="task-title">Название задачи</FieldLabel>
            <Input
              id="task-title"
              {...forms.register('title')}
              aria-invalid={!!forms.errors.title}
              aria-describedby={forms.errors.title ? 'task-title-error' : undefined}
              required
              maxLength={200}
              disabled={busy}
            />
            {forms.errors.title && (
              <FieldError id="task-title-error">Название задачи обязательно.</FieldError>
            )}
          </Field>
          <Field data-disabled={busy} data-invalid={!!forms.errors.description}>
            <FieldLabel htmlFor="task-description">Описание</FieldLabel>
            <Textarea
              id="task-description"
              {...forms.register('description')}
              aria-invalid={!!forms.errors.description}
              aria-describedby={forms.errors.description ? 'task-description-error' : undefined}
              maxLength={10000}
              disabled={busy}
            />
            {forms.errors.description && (
              <FieldError id="task-description-error">
                Описание должно содержать не более 10 000 символов.
              </FieldError>
            )}
          </Field>
          <Field data-disabled={busy} data-invalid={!!forms.errors.object_id}>
            <FieldLabel htmlFor="task-object">Объект</FieldLabel>
            <NativeSelect
              id="task-object"
              {...forms.register('object_id')}
              aria-invalid={!!forms.errors.object_id}
              aria-describedby={forms.errors.object_id ? 'task-object-error' : undefined}
              required
              disabled={busy}
            >
              <NativeSelectOption value="" disabled>
                Выберите объект
              </NativeSelectOption>
              {objects.map(object => (
                <NativeSelectOption key={object.id} value={object.id}>
                  {object.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {forms.errors.object_id && (
              <FieldError id="task-object-error">Выберите объект.</FieldError>
            )}
          </Field>
          <Field data-disabled={busy} data-invalid={!!forms.errors.assignee_id}>
            <FieldLabel htmlFor="task-assignee">Исполнитель</FieldLabel>
            <NativeSelect
              id="task-assignee"
              {...forms.register('assignee_id')}
              aria-invalid={!!forms.errors.assignee_id}
              aria-describedby={forms.errors.assignee_id ? 'task-assignee-error' : undefined}
              required
              disabled={busy}
            >
              <NativeSelectOption value="" disabled>
                Выберите исполнителя
              </NativeSelectOption>
              {states.executors.map(profile => (
                <NativeSelectOption key={profile.id} value={profile.id}>
                  {profile.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {forms.errors.assignee_id && (
              <FieldError id="task-assignee-error">Выберите исполнителя.</FieldError>
            )}
          </Field>
          <Field orientation="horizontal">
            <Button type="submit" disabled={busy || states.executors.length === 0}>
              {busy && <Spinner data-icon="inline-start" aria-label="Сохраняем задачу" />}
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
export default TaskEditor
