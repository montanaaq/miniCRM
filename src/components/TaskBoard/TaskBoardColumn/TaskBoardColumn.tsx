import type { TaskListRow } from '@/components/TaskList/useTaskList'
import type { Status, Task } from '@/shared/types/crm.schema'
import type { WorkspaceHome } from '@/shared/types/routes.types'

import styles from '@/shared/styles/task-board.module.css'
import { TaskStatus } from '@/shared/ui'

import TaskBoardCard from '../TaskBoardCard/TaskBoardCard'
import { useTaskBoardColumn } from './useTaskBoardColumn'

interface TaskBoardColumnProps {
  status: Status
  rows: TaskListRow[]
  home: WorkspaceHome
  busy: boolean
  enabled: boolean
  onMove: (task: Task, status: Status) => void
}
const TaskBoardColumn = ({ status, rows, home, busy, enabled, onMove }: TaskBoardColumnProps) => {
  const { states, functions } = useTaskBoardColumn(status, enabled)
  return (
    <section
      ref={node => functions.onNodeRef(node)}
      aria-labelledby={states.titleId}
      className={styles.column}
      data-target={enabled || undefined}
      data-over={states.isOver || undefined}
    >
      <header className={styles.columnHeading}>
        <h2 id={states.titleId}>
          <TaskStatus status={status} />
        </h2>
        <span className="muted">{rows.length}</span>
      </header>
      <ul className={styles.cards} role="list">
        {rows.map(row => (
          <li key={row.task.id}>
            <TaskBoardCard row={row} home={home} busy={busy} onMove={onMove} />
          </li>
        ))}
      </ul>
      {rows.length === 0 && <p className="muted">Нет задач</p>}
      {enabled && <p className="muted">Перетащите задачу сюда</p>}
    </section>
  )
}
export default TaskBoardColumn
