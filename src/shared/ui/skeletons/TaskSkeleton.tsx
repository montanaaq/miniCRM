import styles from '@/shared/styles/task-card.module.css'

import { Card, CardHeader, CardContent } from '../card'
import { Skeleton } from '../skeleton'
import HistorySkeleton from './HistorySkeleton'

const TaskSkeleton = () => (
  <div className={styles.layout} role="status" aria-label="Загружаем задачу" aria-busy="true">
    <Card aria-hidden="true">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-5 w-full" />
        <Skeleton className="mb-7 h-5 w-2/3" />
        <div className={styles.details}>
          {[0, 1, 2, 3].map(item => (
            <div key={item}>
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-5 w-36" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-40" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-44" />
      </CardHeader>
      <CardContent>
        <HistorySkeleton />
      </CardContent>
    </Card>
  </div>
)
export default TaskSkeleton
