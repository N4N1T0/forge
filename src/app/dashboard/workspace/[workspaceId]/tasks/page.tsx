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
    <section
      id='workspace-tasks'
      className='size-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'
    >
      {/* HEADER */}
      <header className='border-b pb-4 flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Members</h1>
          <p className='text-muted-foreground'>Workspace members list</p>
        </div>

        {/* SEARCH */}
        <div className='w-full max-w-md'>
          <TaskSearchComponent
            placeholder='Search tasks by name or description...'
            isSearching={isSearching}
          />
        </div>
      </header>

      {/* NETWORK ERROR BANNER */}
      {isNetworkError && (
        <TaskPageNetworkError handleRetry={handleNetworkError} />
      )}

      {/* TASK GRID */}
      <div className='flex-1 pt-4'>
        <TaskGrid
          tasks={isNetworkError ? [] : tasks || []}
          members={isNetworkError ? [] : members || []}
          isLoading={isLoading && !isNetworkError}
          searchQuery={search}
          error={isNetworkError}
        />
      </div>
    </section>
  )
}
