import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty'
import { ModalTaskCreateForm } from '@/features/tasks'

export const TaskEmptyView = () => {
  return (
    <Empty className='border size-full'>
      <EmptyHeader>
        <EmptyTitle>No tasks yet</EmptyTitle>
        <EmptyDescription>
          Create your first task to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ModalTaskCreateForm>
          <Button>Create New Task</Button>
        </ModalTaskCreateForm>
      </EmptyContent>
    </Empty>
  )
}
