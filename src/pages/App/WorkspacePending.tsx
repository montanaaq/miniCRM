import WorkspaceLayout from '@/components/WorkspaceLayout/WorkspaceLayout'
import { ROUTES, WORKSPACE_ROUTES } from '@/shared/constants/routes.const'
import UserProvider from '@/shared/contexts/user/UserProvider'
import { userOptions } from '@/shared/queries/user'
import { getHomePath } from '@/shared/route-access'
import styles from '@/shared/styles/workspace.module.css'
import {
  HeadingSkeleton,
  ObjectsSkeleton,
  TaskListSkeleton,
  TaskSkeleton,
  SessionSkeleton
} from '@/shared/ui'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'
import { useMatchRoute } from '@tanstack/react-router'

const WorkspacePending = () => {
  const userQuery = useQuery({ ...userOptions, enabled: false })
  const matchRoute = useMatchRoute()
  const user = userQuery.data
  if (!user) return <SessionSkeleton />
  const home = getHomePath(user)
  if (home === ROUTES.SIGN_IN) return <SessionSkeleton />
  const isTask = !!matchRoute({ to: WORKSPACE_ROUTES[home].task, pending: true })
  const isObject = !!matchRoute({ to: WORKSPACE_ROUTES[home].object, pending: true })
  const isAllTasks = !!matchRoute({ to: ROUTES.ALL_TASKS, pending: true })
  const isMyTasks = !!matchRoute({ to: ROUTES.MY_TASKS, pending: true })
  return (
    <UserProvider user={user}>
      <WorkspaceLayout home={home} fullWidth={isObject || isMyTasks || isAllTasks}>
        {(isObject || isTask) && (
          <span className={styles.back} aria-hidden="true">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} /> Все объекты
          </span>
        )}
        <div className={styles.heading}>
          <HeadingSkeleton />
        </div>
        {isTask && <TaskSkeleton />}
        {(isObject || isMyTasks || isAllTasks) && <TaskListSkeleton />}
        {!isTask && !isObject && !isMyTasks && !isAllTasks && <ObjectsSkeleton />}
      </WorkspaceLayout>
    </UserProvider>
  )
}
export default WorkspacePending
