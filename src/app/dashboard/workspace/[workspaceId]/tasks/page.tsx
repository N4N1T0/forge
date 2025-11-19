'use client'

import { useGetMembers } from '@/features/members/hooks/use-get-members'
import { TaskGrid } from '@/features/tasks/components/page/task-grid'
import { TaskPageNetworkError } from '@/features/tasks/components/page/task-page-errors'
import { TaskSearchComponent } from '@/features/tasks/components/page/task-search'
import { useTaskFilters } from '@/features/tasks/hooks'
import { useGetTasks } from '@/features/tasks/server/use-get-tasks'
import { Params } from '@/types'
import { use } from 'react'

interface TaskListingPageProps {
  params: Params
}

export default function TaskListingPage({ params }: TaskListingPageProps) {
  // PARAMS
  const { workspaceId } = use(params)

  // SEARCH STATE
  const { search } = useTaskFilters()

  // DATA FETCHING
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
    refetch: refetchTasks,
    isFetching: isFetchingTasks
  } = useGetTasks({
    workspaceId: workspaceId as string,
    search: search || undefined
  })

  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers
  } = useGetMembers({
    workspaceId: workspaceId as string
  })

  // LOADING STATE
  const isLoading = isLoadingTasks || isLoadingMembers
  const isSearching = isFetchingTasks && !!search

  // ERROR
  const isNetworkError = tasksError || membersError

  // VALIDATION
  if (!workspaceId || Array.isArray(workspaceId)) {
    throw new Error('Invalid workspace ID')
  }

  // HANDLERS
  const handleNetworkError = () => {
    refetchTasks()
    refetchMembers()
  }

  return (
    <div className='flex flex-col size-full max-w-screen-2xl mx-auto p-4'>
      {/* HEADER */}
      <div className='flex flex-col gap-4 mb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Tasks</h1>
            <p className='text-muted-foreground'>
              Manage and track all workspace tasks
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className='w-full max-w-md'>
          <TaskSearchComponent
            placeholder='Search tasks by name or description...'
            isSearching={isSearching}
          />
        </div>
      </div>

      {/* NETWORK ERROR BANNER */}
      {isNetworkError && (
        <TaskPageNetworkError handleRetry={handleNetworkError} />
      )}

      {/* TASK GRID */}
      <div className='flex-1'>
        <TaskGrid
          tasks={isNetworkError ? [] : tasks || []}
          members={isNetworkError ? [] : members || []}
          isLoading={isLoading && !isNetworkError}
          searchQuery={search}
          error={isNetworkError}
        />
      </div>
    </div>
  )
}
