import type { ErrorComponentProps } from '@tanstack/react-router'

import { Alert, AlertDescription, Button } from '@/shared/ui'

import { useRouteError } from './useRouteError'

const RouteError = ({ error }: ErrorComponentProps) => {
  const { states, functions } = useRouteError(error)
  return (
    <main className="setup">
      <Alert variant="destructive">
        <AlertDescription>{states.error}</AlertDescription>
      </Alert>
      <div className="actions">
        <Button disabled={states.busy} onClick={functions.onRetry}>
          Повторить
        </Button>
        <Button variant="outline" disabled={states.busy} onClick={functions.onSignOut}>
          Выйти
        </Button>
      </div>
    </main>
  )
}
export default RouteError
