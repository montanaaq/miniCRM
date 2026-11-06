import type { ConstructionObject, Profile, Task } from '@/shared/types/crm.schema'
import type { WorkspaceHome } from '@/shared/types/routes.types'

import TaskRow from '@/components/TaskRow/TaskRow'
import { STATUS_LABELS } from '@/shared/constants/task.const'
import styles from '@/shared/styles/task-row.module.css'
import {
  Button,
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  NativeSelect,
  NativeSelectOption,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Spinner
} from '@/shared/ui'
import { lazy, Suspense, useId } from 'react'

import { useTaskList } from './useTaskList'

const TaskBoard = lazy(() => import('@/components/TaskBoard/TaskBoard'))

interface TaskListProps {
  home: WorkspaceHome
  tasks: Task[]
  profiles: Profile[]
  objects: ConstructionObject[]
}
const TaskList = ({ tasks, profiles, objects, home }: TaskListProps) => {
  const { states, functions } = useTaskList(tasks, profiles, objects)
  const id = useId()
  return (
    <Tabs
      value={states.view}
      onValueChange={view => functions.onFilter({ view })}
      className={styles.list}
    >
      <TabsList aria-label="Вид задач" className={styles.viewTabs}>
        <TabsTrigger value="board">Доска</TabsTrigger>
        <TabsTrigger value="table">Таблица</TabsTrigger>
      </TabsList>
      <FieldGroup className={styles.filters}>
        <Field>
          <FieldLabel htmlFor={`${id}-search`}>Поиск задач</FieldLabel>
          <Input
            id={`${id}-search`}
            type="search"
            placeholder="Название, объект или исполнитель"
            value={states.filters.search ?? ''}
            onChange={event => functions.onFilter({ search: event.target.value || undefined })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-status`}>Статус</FieldLabel>
          <NativeSelect
            className="w-full"
            id={`${id}-status`}
            value={states.filters.status ?? ''}
            onChange={event => functions.onFilter({ status: event.target.value || undefined })}
          >
            <NativeSelectOption value="">Все статусы</NativeSelectOption>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        {states.objects.length > 1 && (
          <Field>
            <FieldLabel htmlFor={`${id}-object`}>Объект</FieldLabel>
            <NativeSelect
              className="w-full"
              id={`${id}-object`}
              value={states.filters.objectId ?? ''}
              onChange={event => functions.onFilter({ objectId: event.target.value || undefined })}
            >
              <NativeSelectOption value="">Все объекты</NativeSelectOption>
              {states.objects.map(object => (
                <NativeSelectOption key={object.id} value={object.id}>
                  {object.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
        )}
        {states.assignees.length > 1 && (
          <Field>
            <FieldLabel htmlFor={`${id}-assignee`}>Исполнитель</FieldLabel>
            <NativeSelect
              className="w-full"
              id={`${id}-assignee`}
              value={states.filters.assigneeId ?? ''}
              onChange={event =>
                functions.onFilter({ assigneeId: event.target.value || undefined })
              }
            >
              <NativeSelectOption value="">Все исполнители</NativeSelectOption>
              {states.assignees.map(profile => (
                <NativeSelectOption key={profile.id} value={profile.id}>
                  {profile.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
        )}
      </FieldGroup>
      <div className={styles.results}>
        <p className="muted">
          Показано {states.rows.length} из {tasks.length}
        </p>
        <Button variant="ghost" size="sm" disabled={!states.filtered} onClick={functions.onReset}>
          Сбросить фильтры
        </Button>
      </div>
      {states.rows.length === 0 && (
        <Empty className={styles.empty}>
          <EmptyHeader>
            <EmptyTitle>{tasks.length ? 'Ничего не найдено' : 'Задач пока нет'}</EmptyTitle>
            <EmptyDescription>
              {tasks.length
                ? 'Измените запрос или сбросьте фильтры.'
                : 'Новые задачи появятся здесь после назначения.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      <TabsContent value="board">
        <Suspense fallback={<Spinner aria-label="Загружаем доску задач" />}>
          <TaskBoard rows={states.rows} home={home} />
        </Suspense>
      </TabsContent>
      <TabsContent value="table" className={styles.tablePanel}>
        {states.rows.length > 0 && (
          <div
            className={styles.tableWrapper}
            tabIndex={0}
            role="region"
            aria-label="Таблица задач, прокрутка"
          >
            <table className={styles.table} role="table">
              <caption className="sr-only">Задачи</caption>
              <thead>
                <tr>
                  <th scope="col">Задача</th>
                  <th scope="col">Объект</th>
                  <th scope="col">Исполнитель</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Создана</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {states.rows.map(row => (
                  <TaskRow key={row.task.id} {...row} home={home} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
export default TaskList
