import type { Task } from '@/shared/types/crm.schema'
import type { WorkspaceHome } from '@/shared/types/routes.types'

import TaskLink from '@/components/TaskLink/TaskLink'
import styles from '@/shared/styles/task-row.module.css'
import { TaskStatus } from '@/shared/ui'

interface TaskRowProps {
  home: WorkspaceHome
  task: Task
  assignee: string
  objectName: string
}
const TaskRow = ({ task, assignee, objectName, home }: TaskRowProps) => (
  <tr className={styles.row} role="row">
    <th scope="row" role="rowheader">
      <TaskLink home={home} task={task}>
        {task.title}
      </TaskLink>
    </th>
    <td role="cell" data-label="Объект">
      {objectName}
    </td>
    <td role="cell" data-label="Исполнитель">
      {assignee}
    </td>
    <td role="cell" data-label="Статус">
      <TaskStatus status={task.status} />
    </td>
    <td role="cell" data-label="Создана">
      <time dateTime={task.created_at}>
        {new Date(task.created_at).toLocaleDateString('ru-RU')}
      </time>
    </td>
  </tr>
)
export default TaskRow
