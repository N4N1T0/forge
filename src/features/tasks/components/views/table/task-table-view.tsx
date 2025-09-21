'use client'

import { FormattedTasks } from '@/types'
import { TaskEmptyView } from '../task-empty-view'
import { DataTable } from './data-table'
import { TaskTableColumns } from './task-table-columns'
import { TaskTableSkeleton } from './task-table-skeleton'

// TYPES
interface TaskTableViewProps {
  data: FormattedTasks | undefined
  isLoading: boolean
}

export const TaskTableView = ({
  data = undefined,
  isLoading
}: TaskTableViewProps) => {
  // RENDER
  if (isLoading) {
    return <TaskTableSkeleton />
  }

  // RENDER
  if (!data || data?.length === 0) {
    return <TaskEmptyView />
  }

  return (
    <section className='py-4'>
      <DataTable columns={TaskTableColumns} data={data || []} />
    </section>
  )
}
