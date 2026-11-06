import type { ConstructionObject, Task } from '@/shared/types/crm.schema'
import type { WorkspaceHome } from '@/shared/types/routes.types'

import { WORKSPACE_ROUTES } from '@/shared/constants/routes.const'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator
} from '@/shared/ui'
import { Link } from '@tanstack/react-router'

interface ObjectCardProps {
  home: WorkspaceHome
  object: ConstructionObject
  tasks: Task[]
  index: number
}
const ObjectCard = ({ object, tasks, index, home }: ObjectCardProps) => {
  const count = tasks.filter(task => task.object_id === object.id).length
  const reviewCount = tasks.filter(
    task => task.object_id === object.id && task.status === 'review'
  ).length
  const number = String(index + 1).padStart(2, '0')
  return (
    <Link
      to={WORKSPACE_ROUTES[home].object}
      params={{ objectId: object.id }}
      className="block h-full"
    >
      <Card className="h-full min-h-64">
        <CardHeader>
          <CardDescription>ОБЪЕКТ {number}</CardDescription>
          <CardTitle>{object.name}</CardTitle>
        </CardHeader>
        <CardContent className="grow">
          <p className="muted">{object.address}</p>
        </CardContent>
        <Separator />
        <CardFooter className="flex-wrap justify-between gap-3">
          <span>Задач: {count}</span>
          <span>На проверке: {reviewCount}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
export default ObjectCard
