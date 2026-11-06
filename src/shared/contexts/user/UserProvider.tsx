import type { Profile } from '@/shared/types/crm.schema'
import type { ReactNode } from 'react'

import { UserContext } from './UserContext'

interface UserProviderProps {
  user: Profile | null
  children: ReactNode
}
const UserProvider = ({ user, children }: UserProviderProps) => (
  <UserContext value={{ user }}>{children}</UserContext>
)
export default UserProvider
