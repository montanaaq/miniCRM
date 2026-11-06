import type { Task } from '@/shared/types/crm.schema'
import type { WorkspaceHome } from '@/shared/types/routes.types'
import type { ReactNode } from 'react'

import { WORKSPACE_ROUTES } from '@/shared/constants/routes.const'
import { Link, useParams } from '@tanstack/react-router'

interface TaskLinkProps {
  home: WorkspaceHome
  task: Task
  children: ReactNode
}

const TaskLink = ({ home, task, children }: TaskLinkProps) => {
  const { objectId } = useParams({ strict: false })
  return (
    <Link
      to={WORKSPACE_ROUTES[home].task}
      params={{ taskId: task.id }}
      search={previous => ({ ...previous, fromObject: objectId })}
    >
      {children}
    </Link>
  )
}
export default TaskLink
