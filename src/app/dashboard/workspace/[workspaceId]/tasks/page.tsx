'use client'

import { Button } from '@/components/ui/button'
import { useGetMembers } from '@/features/members/server/use-get-members'
import { TaskGrid } from '@/features/tasks/components/page/task-grid'
import { TaskSearchComponent } from '@/features/tasks/components/page/task-search'
import { useGetTasks } from '@/features/tasks/server/use-get-tasks'
import { Params } from '@/types'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { use, useEffect, useState } from 'react'

interface TaskListingPageProps {
  params: Params
}

export default function TaskListingPage({ params }: TaskListingPageProps) {
  // PARAMS
  const { workspaceId } = use(params)

  // SEARCH STATE
  const [search] = useQueryState('search', {
    ...parseAsString,
    defaultValue: '',
    clearOnDefault: true
  })

  // LOCAL STATE
  const [searchError, setSearchError] = useState<string | null>(null)
  const [networkError, setNetworkError] = useState<string | null>(null)

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

  // EFFECTS
  useEffect(() => {
    if (tasksError || membersError) {
      const errorMessage =
        tasksError?.message || membersError?.message || 'Failed to load data'
      setNetworkError(errorMessage)
    } else {
      setNetworkError(null)
    }
  }, [tasksError, membersError])

  // VALIDATION
  if (!workspaceId || Array.isArray(workspaceId)) {
    throw new Error('Invalid workspace ID')
  }

  // HANDLERS
  const handleRetry = async () => {
    setNetworkError(null)
    try {
      await Promise.all([refetchTasks(), refetchMembers()])
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Retry failed'
      setNetworkError(errorMessage)
    }
  }

  const handleSearchError = (error: string | null) => {
    setSearchError(error)
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
            onSearchError={handleSearchError}
            isSearching={isSearching}
          />
        </div>
      </div>

      {/* NETWORK ERROR BANNER */}
      {networkError && (
        <div className='mb-6 p-4 border border-destructive/20 bg-destructive/5 rounded-lg'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 text-destructive flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-destructive'>
                Network Error
              </p>
              <p className='text-sm text-muted-foreground mt-1'>
                {networkError}
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={handleRetry}
              className='flex items-center gap-2'
            >
              <RefreshCw className='h-4 w-4' />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* SEARCH ERROR BANNER */}
      {searchError && (
        <div className='mb-6 p-4 border border-destructive/20 bg-destructive/5 rounded-lg'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 text-destructive flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-destructive'>
                Search Error
              </p>
              <p className='text-sm text-muted-foreground mt-1'>
                {searchError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TASK GRID */}
      <div className='flex-1'>
        <TaskGrid
          tasks={networkError ? [] : tasks || []}
          members={networkError ? [] : members || []}
          isLoading={isLoading && !networkError}
          searchQuery={search}
          error={searchError || networkError}
        />
      </div>
    </div>
  )
}
