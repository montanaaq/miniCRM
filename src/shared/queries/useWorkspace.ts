import { useUser } from '@/shared/contexts/user/useUser'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

import { workspaceOptions } from './crm'

export const useWorkspace = () => {
  const { user } = useUser()
  if (!user) throw new Error('Workspace requires an authenticated user')
  const params = useParams({ strict: false })
  const workspaceQuery = useSuspenseQuery(workspaceOptions(user))
  const objects = workspaceQuery.data.objects
  const profiles = workspaceQuery.data.profiles
  const tasks = workspaceQuery.data.tasks
  const selectedTask = tasks.find(task => task.id === params.taskId)
  const selectedObject = objects.find(
    object => object.id === (selectedTask?.object_id ?? params.objectId)
  )
  return {
    states: {
      user,
      workspaceQuery,
      objects,
      profiles,
      tasks,
      selectedObject,
      selectedTask,
      isDetail: Boolean(params.objectId || params.taskId),
      objectTasks: tasks.filter(task => task.object_id === selectedObject?.id)
    }
  }
}
