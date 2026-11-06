import { loadProfile } from '@/lib/api'
import { getClient } from '@/lib/supabase'
import { queryOptions } from '@tanstack/react-query'

export const userOptions = queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    const { data, error } = await getClient().auth.getSession()
    if (error) throw error
    if (!data.session) return null
    const profile = await loadProfile(data.session.user.id)
    if (!profile) throw { code: 'PROFILE_MISSING' }
    return profile
  }
})
