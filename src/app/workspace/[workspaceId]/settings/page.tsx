import { getCurrentAction } from '@/features/auth/actions'
import { getWorkspaceAction } from '@/features/workspaces/actions'
import { PageSettings } from '@/features/workspaces/components/page/page-settings'
import { Params } from '@/types'
import { redirect } from 'next/navigation'

interface WorkspaceIdProps {
  params: Params
}

export default async function WorkspacePageSettings({
  params
}: WorkspaceIdProps) {
  const data = await getCurrentAction()
  const { workspaceId } = await params

  if (
    !data.success ||
    !data.data ||
    !workspaceId ||
    Array.isArray(workspaceId)
  ) {
    return redirect('/')
  }

  const initialValues = await getWorkspaceAction({
    workspaceId
  })

  if (!initialValues.success || !initialValues.data) {
    return redirect(`/dashboard/workspace/${workspaceId}`)
  }

  return (
    <section
      id='workspace-settings'
      className='size-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'
    >
      <PageSettings initialValues={initialValues.data} />
    </section>
  )
}
