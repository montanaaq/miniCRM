import { z } from 'zod'

export const ROLE_SCHEMA = z.enum(['manager', 'executor'])
export const STATUS_SCHEMA = z.enum(['new', 'in_progress', 'review', 'accepted', 'revision'])
export const PROFILE_SCHEMA = z.object({ id: z.guid(), name: z.string(), role: ROLE_SCHEMA })
export const OBJECT_SCHEMA = z.object({
  id: z.guid(),
  name: z.string(),
  address: z.string(),
  version: z.int().positive(),
  deleted_at: z.string().nullable()
})
export const TASK_SCHEMA = z.object({
  id: z.guid(),
  title: z.string(),
  description: z.string(),
  object_id: z.guid(),
  assignee_id: z.guid(),
  author_id: z.guid(),
  status: STATUS_SCHEMA,
  created_at: z.iso.datetime({ offset: true }),
  version: z.int().positive(),
  deleted_at: z.string().nullable()
})
export const HISTORY_SCHEMA = z.object({
  id: z.guid(),
  task_id: z.guid(),
  actor_id: z.guid(),
  from_status: STATUS_SCHEMA.nullable(),
  to_status: STATUS_SCHEMA,
  comment: z.string().nullable(),
  created_at: z.iso.datetime({ offset: true })
})
export const OBJECT_INPUT_SCHEMA = z.object({
  name: z.string().trim().min(1).max(160),
  address: z.string().trim().min(1).max(300)
})
export const TASK_INPUT_SCHEMA = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(10000),
  object_id: z.guid(),
  assignee_id: z.guid()
})
export type Role = z.infer<typeof ROLE_SCHEMA>
export type Status = z.infer<typeof STATUS_SCHEMA>
export type Profile = z.infer<typeof PROFILE_SCHEMA>
export type ConstructionObject = z.infer<typeof OBJECT_SCHEMA>
export type Task = z.infer<typeof TASK_SCHEMA>
export type HistoryEntry = z.infer<typeof HISTORY_SCHEMA>
export type ObjectInput = z.infer<typeof OBJECT_INPUT_SCHEMA>
export type TaskInput = z.infer<typeof TASK_INPUT_SCHEMA>

export const SIGN_IN_SCHEMA = z.object({
  email: z.string().trim().pipe(z.email()),
  password: z.string().min(1)
})
