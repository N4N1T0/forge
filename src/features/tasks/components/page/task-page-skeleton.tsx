import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export const TaskCardSkeleton = () => (
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

export const LoadingGrid = ({ className }: { className?: string }) => (
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
