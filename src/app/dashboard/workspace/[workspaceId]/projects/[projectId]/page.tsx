import { Button } from '@/components/ui/button'
import { getCurrentAction } from '@/features/auth/actions'
import { getProjectAction } from '@/features/projects/actions'
import ModalProjectConfig from '@/features/projects/components/modal-project-config'
import ModalTaskForm from '@/features/tasks/components/modal-task-form'
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher'
import { Params } from '@/types'
import { MoreHorizontal, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'

interface ProjectPageProps {
  params: Params
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await getCurrentAction()
  const { projectId } = await params

  if (!user.success || !user.data || !projectId || Array.isArray(projectId)) {
    return redirect('/')
  }

  const initialValues = await getProjectAction({
    projectId
  })

  if (!initialValues.success || !initialValues.data) {
    throw new Error('No Project with that Id Found')
  }

  return (
    <section className='flex flex-col gap-y-4 size-full px-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-primary text-lg'>{initialValues.data?.name}</h2>
        <div className='flex gap-2 items-center justify-center'>
          <ModalTaskForm projectId={initialValues.data.$id}>
            <Button size='icon'>
              <Plus />
            </Button>
          </ModalTaskForm>
          <ModalProjectConfig project={initialValues.data}>
            <Button variant='ghost' size='icon'>
              <MoreHorizontal />
            </Button>
          </ModalProjectConfig>
        </div>
      </div>
      <TaskViewSwitcher />
    </section>
  )
}
