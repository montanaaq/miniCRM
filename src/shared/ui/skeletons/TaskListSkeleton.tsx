import { Skeleton } from '../skeleton'

const TaskListSkeleton = () => (
  <div role="status" aria-label="Загружаем задачи" aria-busy="true">
    <div className="grid gap-5" aria-hidden="true">
      <Skeleton className="h-16 w-full" />
      {[0, 1, 2, 3].map(item => (
        <div key={item} className="flex items-center justify-between gap-4 border-b py-4">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-5 w-1/5" />
        </div>
      ))}
    </div>
  </div>
)
export default TaskListSkeleton
