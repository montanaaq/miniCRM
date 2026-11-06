import type { ConstructionObject, Task } from '@/shared/types/crm.schema'
import type { WorkspaceHome } from '@/shared/types/routes.types'

import ObjectCard from '@/components/ObjectCard/ObjectCard'
import styles from '@/shared/styles/workspace.module.css'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/shared/ui'

interface ObjectListProps {
  objects: ConstructionObject[]
  tasks: Task[]
  home: WorkspaceHome
  emptyDescription: string
}
const ObjectList = ({ objects, tasks, home, emptyDescription }: ObjectListProps) => (
  <>
    <div className={styles.summary}>
      <p>
        Объектов <strong>{objects.length}</strong>
      </p>
      <p>
        Доступных задач <strong>{tasks.length}</strong>
      </p>
    </div>
    {!objects.length && (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Объектов пока нет</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )}
    {!!objects.length && (
      <div className={styles.grid}>
        {objects.map((object, index) => (
          <ObjectCard key={object.id} object={object} tasks={tasks} index={index} home={home} />
        ))}
      </div>
    )}
  </>
)
export default ObjectList
