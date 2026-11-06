import ObjectList from '@/components/ObjectList/ObjectList'
import TaskCard from '@/components/TaskCard/TaskCard'
import TaskList from '@/components/TaskList/TaskList'
import WorkspaceBackLinks from '@/components/WorkspaceBackLinks/WorkspaceBackLinks'
import WorkspaceContent from '@/components/WorkspaceContent/WorkspaceContent'
import WorkspaceLayout from '@/components/WorkspaceLayout/WorkspaceLayout'
import { ROUTES } from '@/shared/constants/routes.const'
import styles from '@/shared/styles/workspace.module.css'

import { useAccount } from './useAccount'

const Account = () => {
  const { states } = useAccount()
  return (
    <WorkspaceLayout
      home={ROUTES.ACCOUNT}
      fullWidth={states.isMyTasks || (!!states.selectedObject && !states.selectedTask)}
    >
      <title>{states.title} - мини-CRM</title>
      {states.isDetail && (
        <WorkspaceBackLinks home={ROUTES.ACCOUNT} objectId={states.selectedObject?.id} />
      )}
      <div className={styles.heading}>
        <div>
          <h1>{states.title}</h1>
        </div>
      </div>
      <WorkspaceContent
        error={states.workspaceQuery.error}
        unavailable={states.isDetail && !states.selectedObject}
        onRetry={() => void states.workspaceQuery.refetch()}
      >
        {!states.isDetail && !states.isMyTasks && (
          <ObjectList
            home={ROUTES.ACCOUNT}
            objects={states.objects}
            tasks={states.tasks}
            emptyDescription="Объекты появятся, когда вам назначат задачи."
          />
        )}
        {states.selectedTask && states.selectedObject && (
          <TaskCard
            key={states.selectedTask.id}
            task={states.selectedTask}
            objectName={states.selectedObject.name}
            profile={states.user}
            profiles={states.profiles}
          />
        )}
        {((states.selectedObject && !states.selectedTask) || states.isMyTasks) && (
          <>
            <h2 className={styles.taskHeading}>Задачи</h2>
            <TaskList
              home={ROUTES.ACCOUNT}
              tasks={states.visibleTasks}
              profiles={states.profiles}
              objects={states.objects}
            />
          </>
        )}
      </WorkspaceContent>
    </WorkspaceLayout>
  )
}
export default Account
