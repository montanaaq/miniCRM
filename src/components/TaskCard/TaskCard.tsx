import type { TaskCardProps } from './useTaskCard'

import { ACTION_LABELS, STATUS_LABELS } from '@/shared/constants/task.const'
import styles from '@/shared/styles/task-card.module.css'
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
  Separator,
  Spinner,
  Textarea,
  HistorySkeleton,
  TaskStatus
} from '@/shared/ui'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { useTaskCard } from './useTaskCard'

const TaskCard = (props: TaskCardProps) => {
  const { states, functions } = useTaskCard(props)
  return (
    <div className={styles.layout}>
      <Card>
        <CardHeader>
          <CardTitle>О задаче</CardTitle>
          <CardAction>
            <TaskStatus status={props.task.status} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className={styles.description}>{props.task.description || 'Описание не добавлено.'}</p>
          <dl className={styles.details}>
            <div>
              <dt>Объект</dt>
              <dd>{props.objectName}</dd>
            </div>
            <div>
              <dt>Исполнитель</dt>
              <dd>{states.assignee}</dd>
            </div>
            <div>
              <dt>Автор</dt>
              <dd>{states.author}</dd>
            </div>
            <div>
              <dt>Создана</dt>
              <dd>{states.createdAt}</dd>
            </div>
          </dl>
        </CardContent>
        {states.error && (
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{states.error}</AlertDescription>
            </Alert>
          </CardContent>
        )}
        {states.actions.length > 0 && (
          <>
            <Separator />
            <CardContent className="flex flex-col gap-5">
              <h3>Следующее действие</h3>
              <FieldGroup>
                <Field data-disabled={states.busy} data-invalid={Boolean(states.commentError)}>
                  <FieldLabel htmlFor="task-comment">Комментарий</FieldLabel>
                  <Textarea
                    id="task-comment"
                    value={states.comment}
                    onChange={event => functions.onCommentChange(event.target.value)}
                    maxLength={2000}
                    disabled={states.busy}
                    aria-invalid={Boolean(states.commentError)}
                    aria-describedby={
                      states.commentError
                        ? 'task-comment-hint task-comment-error'
                        : 'task-comment-hint'
                    }
                  />
                  <FieldDescription id="task-comment-hint">
                    При возврате на доработку комментарий обязателен.
                  </FieldDescription>
                  {states.commentError && (
                    <FieldError id="task-comment-error">{states.commentError}</FieldError>
                  )}
                </Field>
              </FieldGroup>
              <div className="actions">
                {states.actions.map(status => (
                  <Button
                    key={status}
                    variant={status === 'revision' ? 'outline' : 'default'}
                    disabled={states.busy}
                    onClick={() => functions.onTransition(status)}
                  >
                    {states.busy && <Spinner data-icon="inline-start" aria-label="Меняем статус" />}
                    {ACTION_LABELS[status]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </>
        )}
        {states.actions.length === 0 && (
          <CardFooter>
            <p className="muted">В этом статусе у вас нет действий по выполнению задачи.</p>
          </CardFooter>
        )}
      </Card>
      <Card aria-labelledby="history-title">
        <CardHeader>
          <CardTitle id="history-title">История статусов</CardTitle>
        </CardHeader>
        <CardContent>
          {states.loading && <HistorySkeleton />}
          {states.historyError && (
            <Alert variant="destructive">
              <AlertDescription>{states.historyError}</AlertDescription>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-fit"
                onClick={functions.onRetry}
              >
                Повторить
              </Button>
            </Alert>
          )}
          {!states.loading && !states.historyError && (
            <ol className={styles.history} role="list">
              {states.entries.map(entry => (
                <li key={entry.id}>
                  <p className={styles.historyStatus}>
                    {entry.from_status && (
                      <>
                        <span>{STATUS_LABELS[entry.from_status]}</span>
                        <span aria-hidden="true">
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={16}
                            aria-hidden="true"
                            className="mx-1 inline align-middle"
                          />
                        </span>
                        <span className="sr-only">изменён на</span>
                      </>
                    )}
                    {STATUS_LABELS[entry.to_status]}
                  </p>
                  <p className="muted">
                    {functions.getProfileName(entry.actor_id)} ·{' '}
                    <time dateTime={entry.created_at}>
                      {functions.formatDate(entry.created_at)}
                    </time>
                  </p>
                  {entry.comment && <p className={styles.comment}>{entry.comment}</p>}
                </li>
              ))}
            </ol>
          )}
          {!states.loading && !states.historyError && states.entries.length === 0 && (
            <p className="muted">История пока пуста.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default TaskCard
