import { Button } from '@/components/ui/button'
import { getCurrentAction } from '@/features/auth/actions'
import { getProjectAction } from '@/features/projects/actions'
import ModalProjectConfig from '@/features/projects/components/modal-project-config'
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher'
import { Params } from '@/types'
import { MoreHorizontal } from 'lucide-react'
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
        <ModalProjectConfig project={initialValues.data}>
          <Button variant='ghost' size='icon'>
            <MoreHorizontal />
          </Button>
        </ModalProjectConfig>
      </div>
      <TaskViewSwitcher />
    </section>
  )
}
