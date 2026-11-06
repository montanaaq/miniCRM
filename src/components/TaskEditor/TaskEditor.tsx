import type { ConstructionObject, Profile, Task, TaskInput } from '@/shared/types/crm.schema'

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
  NativeSelect,
  NativeSelectOption,
  Spinner,
  Textarea
} from '@/shared/ui'

import { useTaskEditor } from './useTaskEditor'

interface TaskEditorProps {
  task?: Task
  objectId: string
  objects: ConstructionObject[]
  profiles: Profile[]
  busy: boolean
  onSave: (input: TaskInput) => Promise<void>
  onCancel: () => void
  onChange: () => void
}
const TaskEditor = ({
  task,
  objectId,
  objects,
  profiles,
  busy,
  onSave,
  onCancel,
  onChange
}: TaskEditorProps) => {
  const { states, functions } = useTaskEditor(task, profiles, onSave)
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
          {states.executors.length === 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Нет исполнителей. Обратитесь к администратору, чтобы добавить сотрудника.
              </AlertDescription>
            </Alert>
          )}
          <Field data-disabled={busy}>
            <FieldLabel htmlFor="task-title">Название задачи</FieldLabel>
            <Input
              id="task-title"
              name="title"
              defaultValue={task?.title}
              required
              maxLength={200}
              disabled={busy}
            />
          </Field>
          <Field data-disabled={busy}>
            <FieldLabel htmlFor="task-description">Описание</FieldLabel>
            <Textarea
              id="task-description"
              name="description"
              defaultValue={task?.description}
              maxLength={10000}
              disabled={busy}
            />
          </Field>
          <Field data-disabled={busy}>
            <FieldLabel htmlFor="task-object">Объект</FieldLabel>
            <NativeSelect
              id="task-object"
              name="object_id"
              defaultValue={task?.object_id ?? objectId}
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
          </Field>
          <Field data-disabled={busy}>
            <FieldLabel htmlFor="task-assignee">Исполнитель</FieldLabel>
            <NativeSelect
              id="task-assignee"
              name="assignee_id"
              defaultValue={task?.assignee_id ?? ''}
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
