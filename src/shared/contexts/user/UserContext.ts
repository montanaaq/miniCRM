import type { Profile } from '@/shared/types/crm.schema'

import { createContext } from 'react'

export const UserContext = createContext<{ user: Profile | null } | null>(null)
