import type { TaskListRow } from '@/components/TaskList/useTaskList'
import type { WorkspaceHome } from '@/shared/types/routes.types'

import { BOARD_STATUSES } from '@/shared/constants/task.const'
import styles from '@/shared/styles/task-board.module.css'
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  Textarea,
  Spinner
} from '@/shared/ui'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { createPortal } from 'react-dom'

import TaskBoardColumn from './TaskBoardColumn'
import { useTaskBoard } from './useTaskBoard'

const TaskBoard = ({ rows, home }: { rows: TaskListRow[]; home: WorkspaceHome }) => {
  const { states, functions } = useTaskBoard(rows)
  return (
    <>
      {states.error && !states.revisionTask && (
        <Alert variant="destructive" className={styles.error}>
          <AlertDescription>{states.error}</AlertDescription>
        </Alert>
      )}
      <p role="status" className={styles.toolbar}>
        {states.busy ? 'Сохраняем изменение статуса…' : states.announcement}
      </p>
      <DndContext
        sensors={states.sensors}
        onDragStart={event => functions.onDragStart(event.active.id)}
        onDragEnd={event => functions.onDragEnd(event.over?.id ?? null)}
        onDragCancel={functions.onDragCancel}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              'Нажмите пробел или Enter, чтобы взять задачу. Перемещайте стрелками, завершите пробелом или Enter. Escape отменяет перенос. Можно использовать список «Переместить в».'
          },
          announcements: {
            onDragStart: () => 'Задача выбрана для переноса. Доступные колонки подсвечены.',
            onDragOver: ({ over }) =>
              over ? 'Задача над доступной колонкой.' : 'Задача вне доступной колонки.',
            onDragEnd: () => 'Перенос завершён. Результат сохранения будет объявлен отдельно.',
            onDragCancel: () => 'Перенос отменён.'
          }
        }}
      >
        <div
          className={styles.board}
          tabIndex={0}
          role="region"
          aria-label="Доска задач, горизонтальная прокрутка"
          aria-busy={states.busy}
        >
          {BOARD_STATUSES.map(status => (
            <TaskBoardColumn
              key={status}
              status={status}
              rows={rows.filter(row => row.task.status === status)}
              home={home}
              busy={states.busy || !!states.revisionTask}
              enabled={!states.busy && states.targets.includes(status)}
              onMove={functions.onMove}
            />
          ))}
        </div>
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {states.draggedTask && (
              <Card size="sm" aria-hidden="true">
                <CardHeader>
                  <CardTitle>{states.draggedTask.title}</CardTitle>
                </CardHeader>
              </Card>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      <Dialog
        open={!!states.revisionTask}
        disablePointerDismissal
        onOpenChange={(open, details) => {
          if (states.busy) {
            details.cancel()
            return
          }
          if (!open) functions.onCancelRevision()
        }}
      >
        <DialogContent showCloseButton={!states.busy}>
          <DialogHeader>
            <DialogTitle>Вернуть на доработку</DialogTitle>
            <DialogDescription>
              {states.revisionTask?.title}. Укажите, что нужно исправить.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={event => {
              event.preventDefault()
              void functions.onConfirmRevision()
            }}
            aria-busy={states.busy}
          >
            <FieldGroup>
              {(states.error || states.revisionRefreshError || states.revisionUnavailable) && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {states.revisionRefreshError ||
                      (states.revisionUnavailable
                        ? 'Задача недоступна или её больше нельзя вернуть на доработку. Комментарий можно скопировать.'
                        : states.error)}
                  </AlertDescription>
                  {states.statusConflict && (
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3"
                      disabled={states.busy}
                      onClick={() => void functions.onRefreshRevision()}
                    >
                      Обновить данные
                    </Button>
                  )}
                </Alert>
              )}
              <Field data-disabled={states.busy} data-invalid={!!states.commentError}>
                <FieldLabel htmlFor="board-revision-comment">Комментарий</FieldLabel>
                <Textarea
                  id="board-revision-comment"
                  value={states.comment}
                  onChange={event => functions.onCommentChange(event.target.value)}
                  required
                  maxLength={2000}
                  disabled={states.busy}
                  aria-invalid={!!states.commentError}
                  aria-describedby={states.commentError ? 'board-revision-error' : undefined}
                />
                {states.commentError && (
                  <FieldError id="board-revision-error">{states.commentError}</FieldError>
                )}
              </Field>
              <Field orientation="horizontal">
                <Button type="submit" disabled={states.busy || states.revisionBlocked}>
                  {states.busy && (
                    <Spinner data-icon="inline-start" aria-label="Возвращаем задачу" />
                  )}
                  Вернуть
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={states.busy}
                  onClick={functions.onCancelRevision}
                >
                  Отмена
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default TaskBoard
