import styles from '@/shared/styles/workspace.module.css'

import { Card, CardHeader, CardContent, CardFooter } from '../card'
import { Separator } from '../separator'
import { Skeleton } from '../skeleton'

const ObjectsSkeleton = () => (
  <div role="status" aria-label="Загружаем объекты" aria-busy="true">
    <div aria-hidden="true">
      <div className={styles.summary}>
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-7 w-40" />
      </div>
      <div className={styles.grid}>
        {[0, 1, 2].map(item => (
          <Card key={item} className="min-h-64">
            <CardHeader>
              <Skeleton className="mb-2 h-5 w-20" />
              <Skeleton className="h-7 w-3/4" />
            </CardHeader>
            <CardContent className="grow">
              <Skeleton className="h-5 w-4/5" />
            </CardContent>
            <Separator />
            <CardFooter className="justify-between gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </div>
)
export default ObjectsSkeleton
