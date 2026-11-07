import type { Profile, Status, Task } from '@/shared/types/crm.schema'

export const getAvailableActions = (task: Task, profile: Profile): Status[] => {
  if (profile.role === 'manager') return task.status === 'review' ? ['accepted', 'revision'] : []
  if (task.assignee_id !== profile.id) return []
  if (task.status === 'new' || task.status === 'revision') return ['in_progress']

  return task.status === 'in_progress' ? ['review'] : []
}

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(date)
  )
