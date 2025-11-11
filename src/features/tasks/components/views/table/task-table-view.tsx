'use client'

import { TaskViewError } from '@/features/tasks/components/views'
import {
  TaskEmptySearchView,
  TaskEmptyView
} from '@/features/tasks/components/views/empty'
import {
  DataTable,
  TaskTableColumns,
  TaskTableSkeleton
} from '@/features/tasks/components/views/table'
import { useTaskFilters } from '@/features/tasks/hooks'
import { DataViewProps } from '@/types'

// TYPES
type TaskTableViewProps = DataViewProps

export const TaskTableView = ({
  data,
  isLoading,
  error = false,
  refetch
}: TaskTableViewProps) => {
  // HOOKS
  const { isAnyFilterActive } = useTaskFilters()

  // RENDER
  if (isLoading) {
    return <TaskTableSkeleton />
  }

  if (error && !isLoading) {
    return <TaskViewError handleRetry={refetch} />
  }

  if ((!data || data.length === 0) && !isAnyFilterActive) {
    return <TaskEmptyView />
  }

  if ((!data || data.length === 0) && isAnyFilterActive) {
    return <TaskEmptySearchView />
  }

  return (
    <section className='py-4 size-full'>
      <DataTable columns={TaskTableColumns} data={data || []} />
    </section>
  )
}
