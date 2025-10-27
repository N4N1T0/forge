import { getCurrentAction } from '@/features/auth/actions'
import { getProjectAction } from '@/features/projects/actions'
import { TaskViewSwitcher } from '@/features/tasks/components/views'
import { Params } from '@/types'
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
      <TaskViewSwitcher initialValues={initialValues.data} />
    </section>
  )
}
