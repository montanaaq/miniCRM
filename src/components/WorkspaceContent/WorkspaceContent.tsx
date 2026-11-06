import type { ReactNode } from 'react'

import { getErrorMessage } from '@/lib/api'
import {
  Alert,
  AlertDescription,
  Button,
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription
} from '@/shared/ui'

interface WorkspaceContentProps {
  error: unknown
  unavailable: boolean
  children: ReactNode
  onRetry: () => void
}
const WorkspaceContent = ({ error, unavailable, children, onRetry }: WorkspaceContentProps) => {
  return (
    <>
      {Boolean(error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          <Button variant="outline" className="mt-3" onClick={onRetry}>
            Повторить
          </Button>
        </Alert>
      )}
      {unavailable && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Запись недоступна</EmptyTitle>
            <EmptyDescription>Её удалили, переназначили или у вас нет доступа.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!unavailable && children}
    </>
  )
}
export default WorkspaceContent
