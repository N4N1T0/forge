import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { useTaskFilters } from '@/features/tasks'
import { CheckSquare, Search, SearchSlash } from 'lucide-react'

// EMPTY STATES (NO TASKS)
export const NoTasksEmpty = () => (
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

// EMPTY STATES (NO SEARCH RESULTS)
export const NoSearchResultsEmpty = ({
  searchQuery
}: {
  searchQuery: string
}) => {
  const { resetFilters } = useTaskFilters()

  return (
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
      <EmptyContent>
        <Button onClick={resetFilters} variant='outline'>
          <SearchSlash className='mr-2 h-4 w-4' />
          Reset Search
        </Button>
      </EmptyContent>
    </Empty>
  )
}
