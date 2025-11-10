import { Skeleton } from '@/components/ui/skeleton'

export default function WorkspaceLoading() {
  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='space-y-6'>
        {/* DASHBOARD HEADER SKELETON */}
        <div>
          <Skeleton className='h-8 w-48 mb-2' />
          <Skeleton className='h-4 w-96' />
        </div>

        {/* DASHBOARD GRID SKELETON */}
        <div className='grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {/* CARD SKELETONS */}
          {[1, 2, 3].map((i) => (
            <div key={i} className='rounded-lg border bg-card p-6 space-y-4'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-32 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
