import { expect, it } from 'vite-plus/test'

import { getErrorMessage } from './api'

it('подсказывает миграцию, когда Supabase сообщает об отсутствии версии записи', () => {
  expect(
    getErrorMessage({ code: '42703', message: 'column objects.version does not exist' })
  ).toContain('202611060001_record_versions.sql')
  expect(
    getErrorMessage({ code: '42703', message: 'column objects.address does not exist' })
  ).not.toContain('202611060001_record_versions.sql')
})
