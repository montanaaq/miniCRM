import type { TaskListRow } from '@/components/TaskList/useTaskList'
import type { Status, Task } from '@/shared/types/crm.schema'
import type { WorkspaceHome } from '@/shared/types/routes.types'

import TaskLink from '@/components/TaskLink/TaskLink'
import { STATUS_LABELS } from '@/shared/constants/task.const'
import styles from '@/shared/styles/task-board.module.css'
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Field,
  FieldLabel,
  NativeSelect,
  NativeSelectOption,
  TaskStatus
} from '@/shared/ui'
import { DragDropVerticalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { useTaskBoardCard } from './useTaskBoardCard'

interface TaskBoardCardProps {
  row: TaskListRow
  home: WorkspaceHome
  busy: boolean
  onMove: (task: Task, status: Status) => void
}
const TaskBoardCard = ({ row, home, busy, onMove }: TaskBoardCardProps) => {
  const { states, functions } = useTaskBoardCard(row.task, busy, onMove)
  return (
    <div
      ref={node => functions.onNodeRef(node)}
      data-dragging={states.isDragging || undefined}
      className={styles.card}
    >
      <Card size="sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <TaskStatus status={row.task.status} />
            {states.actions.length > 0 && (
              <Button
                ref={node => functions.onActivatorRef(node)}
                {...states.attributes}
                {...states.listeners}
                variant="ghost"
                size="icon-sm"
                disabled={busy}
                className={styles.handle}
                aria-label={`Переместить задачу «${row.task.title}»`}
              >
                <HugeiconsIcon icon={DragDropVerticalIcon} aria-hidden="true" />
              </Button>
            )}
          </div>
          <h3 className={styles.title}>
            <TaskLink home={home} task={row.task}>
              {row.task.title}
            </TaskLink>
          </h3>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="muted">{row.objectName}</p>
            <p className="muted">{row.assignee}</p>
          </div>
          {states.actions.length > 0 && (
            <Field data-disabled={busy}>
              <FieldLabel htmlFor={states.id}>Переместить в</FieldLabel>
              <NativeSelect
                id={states.id}
                className="w-full"
                size="sm"
                value=""
                disabled={busy}
                onChange={event => functions.onSelect(event.target.value)}
              >
                <NativeSelectOption value="" disabled>
                  Выберите статус
                </NativeSelectOption>
                {states.actions.map(status => (
                  <NativeSelectOption key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default TaskBoardCard
