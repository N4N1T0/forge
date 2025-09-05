import { getCurrentAction } from '@/features/auth/actions'
import { getWorkspaceInfoAction } from '@/features/workspaces/actions'
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form'
import { redirect } from 'next/navigation'

export default async function JoinWorkspacePage({
  searchParams
}: JoinWorkspaceProps) {
  const { inviteCode, workspaceId } = await searchParams
  const user = await getCurrentAction()

  if (!user.success || !user.data) {
    return redirect('/')
  }

  if (!inviteCode || !workspaceId) {
    return redirect('/dashboard')
  }

  const workspaceInfo = await getWorkspaceInfoAction({
    workspaceId: workspaceId as string
  })

  if (!workspaceInfo.success || !workspaceInfo.data) {
    return redirect('/dashboard')
  }

  const initialValues = {
    name: workspaceInfo.data.name,
    workspaceId: workspaceId as string,
    inviteCode: inviteCode as string
  }

  return (
    <div className='overflow-auto pb-16 min-h-screen w-full flex justify-center items-center'>
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  )
}
