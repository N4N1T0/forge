import { getCurrentAction } from '@/features/auth/actions'
import { getWorkspaceInfoAction } from '@/features/workspaces/actions'
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form'
import { Params } from '@/types'
import { redirect } from 'next/navigation'

// TYPES
interface JoinWorkspacePageProps {
  searchParams: Params
}

export default async function JoinWorkspacePage({
  searchParams
}: JoinWorkspacePageProps) {
  // VALIDATE SEARCH PARAMS
  const { inviteCode, workspaceId, icon } = await searchParams
  const user = await getCurrentAction()

  // VALIDATE USER
  if (!user.success || !user.data) {
    return redirect(
      `/?workspaceId=${workspaceId}&inviteCode=${inviteCode}&icon=${icon}`
    )
  }

  // VALIDATE INVITE CODE AND WORKSPACE ID
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
