import type {
  ConstructionObject,
  ObjectInput,
  Status,
  Task,
  TaskInput
} from '@/shared/types/crm.schema'

import { getClient } from '@/lib/supabase'
import {
  HISTORY_SCHEMA,
  OBJECT_INPUT_SCHEMA,
  OBJECT_SCHEMA,
  PROFILE_SCHEMA,
  TASK_INPUT_SCHEMA,
  TASK_SCHEMA
} from '@/shared/types/crm.schema'
import { z } from 'zod'

export const getErrorMessage = (error: unknown) => {
  if (error instanceof z.ZodError)
    return 'Получены некорректные данные. Обновите страницу; если ошибка повторится, обратитесь к администратору.'
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = error.code
    if (code === 'PROFILE_MISSING')
      return 'Профиль не настроен. Попросите администратора назначить роль.'
    if (code === 'INPUT_INVALID')
      return 'Проверьте обязательные поля: название и адрес не могут состоять из пробелов.'
    if (code === 'PGRST116' || code === 'NOT_FOUND')
      return 'Запись уже изменилась или недоступна. Обновите данные.'
    if (code === 'EDIT_CONFLICT')
      return 'Запись уже изменилась или недоступна. Скопируйте свои правки, откройте актуальную запись и повторите редактирование.'
    if (code === '40001') return 'Задача уже изменилась. Обновите данные и повторите действие.'
    if (code === '42501') return 'Недостаточно прав. Проверьте назначение роли и доступ к данным.'
    if (code === '23503') return 'Сначала удалите задачи объекта.'
    if (code === '23514')
      return 'Действие недоступно. Проверьте статус, исполнителя и обязательные поля.'
    if (
      code === '42703' &&
      'message' in error &&
      typeof error.message === 'string' &&
      /\bversion\b/.test(error.message)
    )
      return 'База ещё не обновлена. Примените миграцию 202611060001_record_versions.sql в Supabase.'
    if (code === 'PGRST205' || code === '42P01')
      return 'База ещё не подготовлена. Примените миграцию из папки supabase/migrations.'
  }
  return 'Не удалось выполнить запрос. Проверьте подключение и повторите попытку.'
}

export const loadProfile = async (userId: string) => {
  const { data, error } = await getClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data ? PROFILE_SCHEMA.parse(data) : null
}

export const loadWorkspace = async () => {
  const client = getClient()
  // shortcut: Workspace loads up to the Supabase row limit; add pagination before larger datasets.
  const [profiles, objects, tasks] = await Promise.all([
    client.from('profiles').select('*'),
    client
      .from('objects')
      .select('id,name,address,version,deleted_at')
      .is('deleted_at', null)
      .order('name'),
    client
      .from('tasks')
      .select(
        'id,title,description,object_id,assignee_id,author_id,status,created_at,version,deleted_at'
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
  ])
  for (const response of [profiles, objects, tasks]) if (response.error) throw response.error
  const people = PROFILE_SCHEMA.array().parse(profiles.data)
  return {
    profiles: people,
    objects: OBJECT_SCHEMA.array().parse(objects.data),
    tasks: TASK_SCHEMA.array().parse(tasks.data)
  }
}

export const loadHistory = async (taskId: string) => {
  const { data, error } = await getClient()
    .from('task_history')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at')
    .order('id')
  if (error) throw error
  return HISTORY_SCHEMA.array().parse(data)
}

export const saveObject = async (input: ObjectInput, original?: ConstructionObject) => {
  const parsed = OBJECT_INPUT_SCHEMA.safeParse(input)
  if (!parsed.success) throw { code: 'INPUT_INVALID' }
  const values = parsed.data
  const query = getClient().from('objects')
  const { data, error } = await (
    original
      ? query
          .update(values)
          .eq('id', original.id)
          .eq('version', original.version)
          .is('deleted_at', null)
      : query.insert(values)
  )
    .select('id')
    .maybeSingle()
  if (!error && !data) throw { code: original ? 'EDIT_CONFLICT' : 'NOT_FOUND' }
  if (error) throw error
}
export const saveTask = async (input: TaskInput, original?: Task) => {
  const parsed = TASK_INPUT_SCHEMA.safeParse(input)
  if (!parsed.success) throw { code: 'INPUT_INVALID' }
  const values = parsed.data
  const query = getClient().from('tasks')
  const { data, error } = await (
    original
      ? query
          .update(values)
          .eq('id', original.id)
          .eq('version', original.version)
          .is('deleted_at', null)
      : query.insert(values)
  )
    .select('id')
    .maybeSingle()
  if (!error && !data) throw { code: original ? 'EDIT_CONFLICT' : 'NOT_FOUND' }
  if (error) throw error
}
export const deleteObject = async (id: string) => {
  const { data, error } = await getClient()
    .from('objects')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null)
    .select('id')
    .single()
  if (error) throw error
  if (!data) throw { code: 'NOT_FOUND' }
}
export const deleteTask = async (id: string) => {
  const { data, error } = await getClient()
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null)
    .select('id')
    .single()
  if (error) throw error
  if (!data) throw { code: 'NOT_FOUND' }
}
export const changeStatus = async (task: Task, status: Status, comment: string) => {
  const { error } = await getClient().rpc('change_task_status', {
    p_task_id: task.id,
    p_expected_status: task.status,
    p_status: status,
    p_comment: comment.trim()
  })
  if (error) throw error
}

export const signOut = async () => {
  const { error } = await getClient().auth.signOut({ scope: 'local' })
  if (error) throw error
}
