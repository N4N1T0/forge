import { getCurrentAction } from '@/features/auth/actions'
import { WorkspaceDashboard } from '@/features/dashboard/components/workspace-dashboard'
import { Params } from '@/types'
import { redirect } from 'next/navigation'

interface WorkspacePageProps {
  params: Params
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const user = await getCurrentAction()
  const { workspaceId } = await params

  if (
    !user.success ||
    !user.data ||
    !workspaceId ||
    Array.isArray(workspaceId)
  ) {
    return redirect('/')
  }

  return (
    <section
      id='workspace-dashboard'
      className='size-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'
    >
      <WorkspaceDashboard workspaceId={workspaceId} />
    </section>
  )
}
