import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardCardSkeleton() {
  return (
    <Card
      role='status'
      aria-live='polite'
      aria-busy='true'
      aria-label='Loading dashboard card'
    >
      <CardHeader>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-4 w-48 mt-2' />
      </CardHeader>
      <CardContent className='space-y-3'>
        <Skeleton className='h-24 w-full' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </CardContent>
      <span className='sr-only'>Loading content, please wait...</span>
    </Card>
  )
}
