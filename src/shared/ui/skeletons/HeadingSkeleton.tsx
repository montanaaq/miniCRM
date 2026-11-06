import styles from '@/shared/styles/workspace.module.css'

import { Skeleton } from '../skeleton'

const HeadingSkeleton = () => (
  <div role="status" aria-label="Загружаем данные записи" aria-busy="true">
    <div aria-hidden="true">
      <Skeleton className={styles.titleSkeleton} />
      <Skeleton className="h-5 w-56 max-w-full" />
    </div>
  </div>
)
export default HeadingSkeleton
