import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty'
import { useProjectId } from '@/features/projects/hooks/use-project-id'
import { ModalTaskCreateForm } from '@/features/tasks/components/create'

export const TaskEmptyView = () => {
  const projectId = useProjectId()

  return (
    <Empty className='border size-full'>
      <EmptyHeader>
        <EmptyTitle>No tasks yet</EmptyTitle>
        <EmptyDescription>
          Create your first task to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ModalTaskCreateForm projectId={projectId}>
          <Button>Create New Task</Button>
        </ModalTaskCreateForm>
      </EmptyContent>
    </Empty>
  )
}
