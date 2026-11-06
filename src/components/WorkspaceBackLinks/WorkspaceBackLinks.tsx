import type { WorkspaceHome } from '@/shared/types/routes.types'

import { ROUTES, WORKSPACE_ROUTES } from '@/shared/constants/routes.const'
import styles from '@/shared/styles/workspace.module.css'
import { TASK_LIST_SEARCH_SCHEMA } from '@/shared/types/task-list-search'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useParams, useSearch } from '@tanstack/react-router'

interface WorkspaceBackLinksProps {
  home: WorkspaceHome
  objectId?: string
}

const WorkspaceBackLinks = ({ home, objectId }: WorkspaceBackLinksProps) => {
  const { taskId } = useParams({ strict: false })
  const search = useSearch({ strict: false })
  const routes = WORKSPACE_ROUTES[home]
  const arrow = <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden="true" />

  if (!taskId)
    return (
      <Link className={styles.back} to={home}>
        {arrow} Все объекты
      </Link>
    )

  if (search.fromObject && search.fromObject === objectId)
    return (
      <Link
        className={styles.back}
        to={routes.object}
        params={{ objectId }}
        search={TASK_LIST_SEARCH_SCHEMA.parse(search)}
      >
        {arrow} К объекту
      </Link>
    )

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        className={styles.back}
        to={routes.tasks}
        search={search.fromObject ? {} : TASK_LIST_SEARCH_SCHEMA.parse(search)}
      >
        {arrow} {home === ROUTES.ADMIN ? 'Все задачи' : 'Мои задачи'}
      </Link>
      {objectId && (
        <Link className={styles.back} to={routes.object} params={{ objectId }}>
          К объекту
        </Link>
      )}
    </div>
  )
}
export default WorkspaceBackLinks
