'use client'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskCard } from '@/features/tasks/components/page/task-card'
import { cn } from '@/lib/utils'
import { FormattedMembers } from '@/types'
import { Tasks } from '@/types/appwrite'
import { CheckSquare, Search } from 'lucide-react'
import { memo } from 'react'

interface TaskGridProps {
  tasks: Tasks[]
  members: FormattedMembers
  isLoading: boolean
  searchQuery?: string
  className?: string
  error: string | null
}

// MEMO
const MemoizedTaskCard = memo(TaskCard)

// LOADING SKELETON
const TaskCardSkeleton = () => (
  <div className='space-y-3 p-6 border rounded-lg'>
    <div className='flex items-start justify-between'>
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-5 w-3/4' />
        <div className='flex gap-2'>
          <Skeleton className='h-5 w-16' />
          <Skeleton className='h-5 w-20' />
        </div>
      </div>
      <Skeleton className='h-8 w-8' />
    </div>
    <div className='space-y-2'>
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-2/3' />
    </div>
    <div className='flex justify-between items-center'>
      <Skeleton className='h-5 w-20' />
    </div>
  </div>
)

// LOADING GRID SKELETON
const LoadingGrid = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      className
    )}
  >
    {Array.from({ length: 8 }).map((_, index) => (
      <TaskCardSkeleton key={index} />
    ))}
  </div>
)

// EMPTY - NO DATA
const NoTasksEmpty = () => (
  <Empty className='size-full'>
    <EmptyHeader>
      <EmptyMedia variant='icon'>
        <CheckSquare />
      </EmptyMedia>
      <EmptyTitle>No tasks yet</EmptyTitle>
      <EmptyDescription>
        Get started by creating your first task for this workspace.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
)

// EMPTY - NO RESULTS
const NoSearchResultsEmpty = ({ searchQuery }: { searchQuery: string }) => (
  <Empty className='size-full'>
    <EmptyHeader>
      <EmptyMedia variant='icon'>
        <Search />
      </EmptyMedia>
      <EmptyTitle>No tasks found</EmptyTitle>
      <EmptyDescription>
        No tasks match your search for &ldquo;{searchQuery}&rdquo;. Try
        adjusting your search terms.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
)

export const TaskGrid = ({
  tasks,
  members,
  isLoading,
  searchQuery,
  error,
  className
}: TaskGridProps) => {
  // RENDER - LOADING
  if (isLoading) {
    return <LoadingGrid className={className} />
  }

  // RENDER - DATA
  if (!tasks?.length) {
    if (error) return null

    const hasSearchQuery = searchQuery?.trim()
    return hasSearchQuery ? (
      <NoSearchResultsEmpty searchQuery={hasSearchQuery} />
    ) : (
      <NoTasksEmpty />
    )
  }

  return (
    <div
      className={cn(
        'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {tasks.map((task) => (
        <MemoizedTaskCard key={task.$id} task={task} members={members} />
      ))}
    </div>
  )
}
