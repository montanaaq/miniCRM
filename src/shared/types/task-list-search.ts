import { z } from 'zod'

import { STATUS_SCHEMA } from './crm.schema'

export const TASK_LIST_SEARCH_SCHEMA = z.object({
  view: z.enum(['board', 'table']).optional().catch(undefined),
  search: z.string().optional().catch(undefined),
  status: STATUS_SCHEMA.optional().catch(undefined),
  objectId: z.string().optional().catch(undefined),
  assigneeId: z.string().optional().catch(undefined)
})

export const TASK_DETAIL_SEARCH_SCHEMA = TASK_LIST_SEARCH_SCHEMA.extend({
  fromObject: z.string().optional().catch(undefined)
})

export type TaskListSearch = z.infer<typeof TASK_LIST_SEARCH_SCHEMA>
