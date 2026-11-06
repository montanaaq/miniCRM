import { ROUTES } from '@/shared/constants/routes.const'
import { useWorkspace } from '@/shared/queries/useWorkspace'
import { useLocation } from '@tanstack/react-router'

export const useAccount = () => {
  const { states } = useWorkspace()
  const location = useLocation()
  const isMyTasks = location.pathname.replace(/\/+$/, '') === ROUTES.MY_TASKS
  return {
    states: {
      ...states,
      isMyTasks,
      title:
        states.selectedTask?.title ??
        states.selectedObject?.name ??
        (isMyTasks ? 'Мои задачи' : 'Объекты'),
      visibleTasks: isMyTasks ? states.tasks : states.objectTasks
    }
  }
}
