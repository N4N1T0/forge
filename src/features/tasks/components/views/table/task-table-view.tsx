'use client'

import { DataViewProps } from '@/types'
import { TaskEmptyView } from '../task-empty-view'
import { DataTable } from './data-table'
import { TaskTableColumns } from './task-table-columns'
import { TaskTableSkeleton } from './task-table-skeleton'

// TYPES
type TaskTableViewProps = DataViewProps

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
    <section className='py-4 size-full'>
      <DataTable columns={TaskTableColumns} data={data || []} />
    </section>
  )
}
