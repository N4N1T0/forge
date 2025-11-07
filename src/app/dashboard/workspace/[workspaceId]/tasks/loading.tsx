import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function TaskCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1 min-w-0'>
            {/* TITLE SKELETON */}
            <Skeleton className='h-5 w-3/4 mb-2' />

            {/* STATUS SKELETON */}
            <div className='flex flex-wrap items-center gap-2'>
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-6 w-24' />
            </div>
          </div>

          {/* ACTION SKELETON */}
          <Skeleton className='h-8 w-8 rounded-md' />
        </div>
      </CardHeader>

      <CardContent>
        {/* DESCRIPTION SKELETON */}
        <div className='mb-3'>
          <Skeleton className='h-4 w-full mb-1' />
          <Skeleton className='h-4 w-2/3' />
        </div>

        {/* ASSIGNEE SKELETON*/}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-16' />
        </div>
      </CardContent>
    </Card>
  )
}

function TasksLoadingSkeleton() {
  return (
    <div className='space-y-6'>
      {/* SEARCH SKELETON */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-10 flex-1' />
        <Skeleton className='h-10 w-10' />
      </div>

      {/* GRID SKELETON */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <TaskCardSkeleton key={`task-skeleton-${index}`} />
        ))}
      </div>
    </div>
  )
}

export default TasksLoadingSkeleton
