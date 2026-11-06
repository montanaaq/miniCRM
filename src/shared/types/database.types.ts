import type {
  ConstructionObject,
  HistoryEntry,
  ObjectInput,
  Profile,
  Status,
  Task,
  TaskInput
} from '@/shared/types/crm.schema'

interface Table<Row, Insert, Update> {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      profiles: Table<Profile, never, never>
      objects: Table<
        ConstructionObject,
        ObjectInput,
        Partial<ObjectInput> & { deleted_at?: string }
      >
      tasks: Table<Task, TaskInput, Partial<TaskInput> & { deleted_at?: string }>
      task_history: Table<HistoryEntry, never, never>
    }
    Views: { [_ in never]: never }
    Functions: {
      change_task_status: {
        Args: { p_task_id: string; p_expected_status: Status; p_status: Status; p_comment?: string }
        Returns: undefined
      }
    }
    Enums: { app_role: Profile['role']; task_status: Status }
    CompositeTypes: { [_ in never]: never }
  }
}
