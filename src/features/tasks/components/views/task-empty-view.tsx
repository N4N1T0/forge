import { Button } from '@/components/ui/button'
import { useProjectId } from '@/features/projects/client/use-project-id'
import { ModalTaskCreateForm } from '@/features/tasks/components/create'

export const TaskEmptyView = () => {
  // HOOKS
  const projectId = useProjectId()

  return (
    <div className='flex flex-col items-center justify-center py-8 gap-4 size-full'>
      <p className='text-lg'>No tasks have been created yet</p>
      <ModalTaskCreateForm projectId={projectId}>
        <Button>Create New Task</Button>
      </ModalTaskCreateForm>
    </div>
  )
}
