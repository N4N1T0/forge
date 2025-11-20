'use client'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty'
import { ModalTaskCreateForm, useTaskFilters } from '@/features/tasks'

export const TaskEmptySearchView = () => {
  // HOOKS
  const { resetFilters } = useTaskFilters()

  // HANDLERS
  const handleReset = () => {
    resetFilters()
  }

  return (
    <Empty className='border size-full'>
      <EmptyHeader>
        <EmptyTitle>No tasks found</EmptyTitle>
        <EmptyDescription>Try changing your search terms.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ModalTaskCreateForm>
          <Button onClick={handleReset}>Reset Filters</Button>
        </ModalTaskCreateForm>
      </EmptyContent>
    </Empty>
  )
}
