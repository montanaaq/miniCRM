import { ROUTES } from '@/shared/constants/routes.const'
import { useWorkspace } from '@/shared/queries/useWorkspace'
import { useLocation, useSearch } from '@tanstack/react-router'

export const useAdmin = () => {
  const { states } = useWorkspace()
  const location = useLocation()
  const { objectId } = useSearch({ strict: false })
  const isAllTasks = location.pathname.replace(/\/+$/, '') === ROUTES.ALL_TASKS
  return {
    states: {
      ...states,
      isAllTasks,
      taskObjectId: states.objects.find(object => object.id === objectId)?.id ?? '',
      title:
        states.selectedTask?.title ??
        states.selectedObject?.name ??
        (isAllTasks ? 'Все задачи' : 'Объекты')
    }
  }
}
