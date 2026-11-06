import type { Database } from '@/shared/types/database.types'

import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const IS_CONFIGURED = Boolean(URL && KEY)
export const supabase = IS_CONFIGURED ? createClient<Database>(URL, KEY) : null

export const getClient = () => {
  if (!supabase)
    throw new Error(
      'Не настроено подключение к Supabase. Заполните .env.local и перезапустите приложение.'
    )
  return supabase
}
