import { Skeleton } from '../skeleton'

const SessionSkeleton = () => (
  <main
    className="grid min-h-svh place-content-center gap-5 px-6"
    role="status"
    aria-label="Проверяем вход"
    aria-busy="true"
  >
    <div aria-hidden="true" className="grid w-64 gap-4">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>
    <p className="text-sm text-muted-foreground">Проверяем учётную запись…</p>
  </main>
)
export default SessionSkeleton
