import styles from '@/shared/styles/task-card.module.css'

import { Skeleton } from '../skeleton'

const HistorySkeleton = () => (
  <div role="status" aria-label="Загружаем историю" aria-busy="true">
    <ol aria-hidden="true" className={styles.history}>
      {[0, 1, 2].map(item => (
        <li key={item}>
          <Skeleton className="mb-1.5 h-5 w-4/5" />
          <Skeleton className="mb-1.5 h-5 w-3/5" />
          {item === 1 && <Skeleton className="mt-3 h-12 w-full" />}
        </li>
      ))}
    </ol>
  </div>
)
export default HistorySkeleton
