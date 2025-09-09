import { getCurrentAction } from '@/features/auth/actions'
import { getWorkspaceAction } from '@/features/workspaces/actions'
import EditWorkspacesForm from '@/features/workspaces/components/workspace-edit-form'
import { WorkspaceIdProps } from '@/types'
import { redirect } from 'next/navigation'

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
    <div className='overflow-auto pb-16 size-full'>
      <EditWorkspacesForm initialValues={initialValues.data} />
    </div>
  )
}
