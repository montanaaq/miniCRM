import type { ConstructionObject, Task } from '@/shared/types/crm.schema'

import { AuthError, PostgrestError } from '@supabase/supabase-js'
import { beforeEach, expect, it, vi } from 'vite-plus/test'
import { z } from 'zod'

import { deleteObject, deleteTask, getErrorMessage } from './api'

const { query } = vi.hoisted(() => ({
  query: {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn()
  }
}))
vi.mock('@/lib/supabase', () => ({ getClient: () => ({ from: () => query }) }))

beforeEach(() => vi.clearAllMocks())

const object: ConstructionObject = {
  id: 'a0000000-0000-0000-0000-000000000001',
  name: 'Объект',
  address: 'Адрес',
  version: 2,
  deleted_at: null
}
const task: Task = {
  id: 'b0000000-0000-0000-0000-000000000001',
  title: 'Задача',
  description: '',
  object_id: object.id,
  assignee_id: '10000000-0000-0000-0000-000000000002',
  author_id: '10000000-0000-0000-0000-000000000001',
  status: 'new',
  created_at: '2026-11-07T00:00:00Z',
  version: 3,
  deleted_at: null
}

;[
  { name: 'объекта', original: object, remove: () => deleteObject(object) },
  { name: 'задачи', original: task, remove: () => deleteTask(task) }
].forEach(({ name, original, remove }) => {
  it(`удаляет только просмотренную версию ${name}`, async () => {
    query.maybeSingle.mockResolvedValueOnce({ data: { id: original.id }, error: null })
    await expect(remove()).resolves.toBeUndefined()
    expect(query.eq).toHaveBeenCalledWith('id', original.id)
    expect(query.eq).toHaveBeenCalledWith('version', original.version)
    expect(query.is).toHaveBeenCalledWith('deleted_at', null)
  })

  it(`сообщает об изменении или недоступности ${name} при удалении`, async () => {
    query.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
    await expect(remove()).rejects.toThrow('Запись уже изменилась или недоступна. Обновите данные.')
  })

  it(`передаёт ошибку БД при удалении ${name}`, async () => {
    const error = new PostgrestError({ code: '42501', message: 'Denied', details: '', hint: '' })
    query.maybeSingle.mockResolvedValueOnce({ data: null, error })
    await expect(remove()).rejects.toBe(error)
  })
})

it.each([
  new PostgrestError({
    code: '42501',
    message: 'Task unavailable',
    details: '',
    hint: ''
  }),
  { code: '42703', message: 'column objects.version does not exist' },
  new AuthError('Session expired'),
  new Error('Профиль не настроен. Попросите администратора назначить роль.')
])('показывает сообщение ошибки без сопоставления кодов: $message', error => {
  expect(getErrorMessage(error)).toBe(error.message)
})

it('не выводит пользователю детали ошибки валидации ответа', () => {
  const result = z.string().safeParse(42)
  expect(result.success).toBe(false)
  expect(getErrorMessage(result.error)).toBe(
    'Получены некорректные данные. Обновите страницу; если ошибка повторится, обратитесь к администратору.'
  )
})

it.each([null, undefined, 'error', {}, { message: 42 }, { message: '' }, { message: '   ' }])(
  'показывает запасной текст для ошибки без сообщения: %j',
  error => {
    expect(getErrorMessage(error)).toBe(
      'Не удалось выполнить запрос. Проверьте подключение и повторите попытку.'
    )
  }
)
