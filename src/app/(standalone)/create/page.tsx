import { getCurrentAction } from '@/features/auth/actions'
import CreateWorkspacesForm from '@/features/workspaces/components/workspace-form'
import { redirect } from 'next/navigation'

export default async function CreateWorkspace() {
  const data = await getCurrentAction()

  if (!data.success || !data.data) {
    return redirect('/')
  }
  return (
    <div className='flex items-center justify-center min-h-screen w-full'>
      <CreateWorkspacesForm />
    </div>
  )
}
