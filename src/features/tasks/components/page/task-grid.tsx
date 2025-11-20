'use client'

import {
  LoadingGrid,
  NoSearchResultsEmpty,
  NoTasksEmpty,
  TaskCard
} from '@/features/tasks'
import { cn } from '@/lib/utils'
import { FormattedMembers } from '@/types'
import { Tasks } from '@/types/appwrite'
import { memo } from 'react'

// TYPES
interface TaskGridProps {
  tasks: Tasks[]
  members: FormattedMembers
  isLoading: boolean
  searchQuery?: string | null
  className?: string
  error: Error | null
}

// MEMO
const MemoizedTaskCard = memo(TaskCard)

export const TaskGrid = ({
  tasks,
  members,
  isLoading,
  searchQuery,
  error,
  className
}: TaskGridProps) => {
  // LOADING
  if (isLoading) {
    return <LoadingGrid className={className} />
  }

  // EMPTY
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
