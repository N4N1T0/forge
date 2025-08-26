import { getCurrentAction } from '@/features/auth/actions'
import { getWorkspaceInfoAction } from '@/features/workspaces/actions'
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form'
import { redirect } from 'next/navigation'

export default async function JoinWorkspacePage({
  params,
  searchParams
}: JoinWorkspaceProps) {
  const { inviteCode } = await searchParams
  const { workspaceId } = await params
  const user = await getCurrentAction()

  if (!user.success || !user.data || !inviteCode || !workspaceId) {
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
    <div className='overflow-auto pb-16 size-full flex justify-center items-center'>
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  )
}
