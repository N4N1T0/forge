import { Modal } from '@/components/ui/modal'
import { getCurrentAction } from '@/features/auth/actions'
import { getWorkspaceAction } from '@/features/workspaces/actions'
import EditWorkspacesForm from '@/features/workspaces/components/workspace-edit-form'
import { Params } from '@/types'
import { redirect } from 'next/navigation'

interface SettingsModalProps {
  params: Params
}

export default async function SettingsModal({ params }: SettingsModalProps) {
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
    <Modal>
      <div className='overflow-auto pb-16 size-full p-6'>
        <EditWorkspacesForm initialValues={initialValues.data} />
      </div>
    </Modal>
  )
}
