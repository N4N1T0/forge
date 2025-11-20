import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { DataViewProps } from '@/types'
import { CheckSquare, RefreshCcw } from 'lucide-react'

// TYPES
interface TaskViewErrorProps {
  handleRetry: DataViewProps['refetch']
}

export const TaskViewError = ({ handleRetry }: TaskViewErrorProps) => (
  <Empty className='size-full border border-destructive bg-destructive/5'>
    <EmptyHeader>
      <EmptyMedia variant='icon' className='bg-destructive text-background'>
        <CheckSquare />
      </EmptyMedia>
      <EmptyTitle>Network Error</EmptyTitle>
      <EmptyDescription>
        Check your internet connection and try again.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button onClick={handleRetry} variant='outline'>
        <RefreshCcw className='mr-2 h-4 w-4' />
        Retry
      </Button>
    </EmptyContent>
  </Empty>
)
