import ObjectList from '@/components/ObjectList/ObjectList'
import ObjectManagement from '@/components/ObjectManagement/ObjectManagement'
import TaskCard from '@/components/TaskCard/TaskCard'
import TaskList from '@/components/TaskList/TaskList'
import TaskManagement from '@/components/TaskManagement/TaskManagement'
import WorkspaceBackLinks from '@/components/WorkspaceBackLinks/WorkspaceBackLinks'
import WorkspaceContent from '@/components/WorkspaceContent/WorkspaceContent'
import WorkspaceLayout from '@/components/WorkspaceLayout/WorkspaceLayout'
import { ROUTES } from '@/shared/constants/routes.const'
import styles from '@/shared/styles/workspace.module.css'

import { useAdmin } from './useAdmin'

const Admin = () => {
  const { states } = useAdmin()
  return (
    <WorkspaceLayout
      home={ROUTES.ADMIN}
      fullWidth={states.isAllTasks || (!!states.selectedObject && !states.selectedTask)}
    >
      <title>{states.title} · мини-CRM</title>
      {states.isDetail && (
        <WorkspaceBackLinks home={ROUTES.ADMIN} objectId={states.selectedObject?.id} />
      )}
      <div className={styles.heading}>
        <div>
          <h1>{states.title}</h1>
          <p className="muted">
            {states.selectedObject?.address ?? 'Объекты, задачи и результаты работы вашей команды.'}
          </p>
        </div>
      </div>
      <WorkspaceContent
        error={states.workspaceQuery.error}
        unavailable={states.isDetail && !states.selectedObject}
        onRetry={() => void states.workspaceQuery.refetch()}
      >
        {!states.isDetail && !states.isAllTasks && (
          <>
            <ObjectManagement />
            <ObjectList
              home={ROUTES.ADMIN}
              objects={states.objects}
              tasks={states.tasks}
              emptyDescription="Создайте первый объект, чтобы поставить задачи."
            />
          </>
        )}
        {states.isAllTasks && (
          <>
            <div className={styles.taskToolbar}>
              <TaskManagement
                objectId={states.taskObjectId}
                objects={states.objects}
                profiles={states.profiles}
              />
              {states.objects.length === 0 && (
                <p className="muted mb-4">Сначала создайте объект в разделе «Объекты».</p>
              )}
            </div>
            <TaskList
              home={ROUTES.ADMIN}
              tasks={states.tasks}
              profiles={states.profiles}
              objects={states.objects}
            />
          </>
        )}
        {states.selectedObject && !states.selectedTask && (
          <>
            <div className={styles.taskToolbar}>
              <ObjectManagement
                key={`object-editor-${states.selectedObject.id}`}
                object={states.selectedObject}
              />
              <TaskManagement
                key={`object-tasks-${states.selectedObject.id}`}
                objectId={states.selectedObject.id}
                objects={states.objects}
                profiles={states.profiles}
              />
            </div>
            <h2 className={styles.taskHeading}>Задачи</h2>
            <TaskList
              home={ROUTES.ADMIN}
              tasks={states.objectTasks}
              profiles={states.profiles}
              objects={states.objects}
            />
          </>
        )}
        {states.selectedTask && states.selectedObject && (
          <>
            <TaskManagement
              key={`task-editor-${states.selectedTask.id}`}
              task={states.selectedTask}
              objectId={states.selectedObject.id}
              objects={states.objects}
              profiles={states.profiles}
            />
            <TaskCard
              key={`task-card-${states.selectedTask.id}`}
              task={states.selectedTask}
              objectName={states.selectedObject.name}
              profile={states.user}
              profiles={states.profiles}
            />
          </>
        )}
      </WorkspaceContent>
    </WorkspaceLayout>
  )
}
export default Admin
