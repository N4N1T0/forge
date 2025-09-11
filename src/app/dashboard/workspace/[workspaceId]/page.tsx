import { getCurrentAction } from '@/features/auth/actions'
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

  return <>WorkspacePage - {workspaceId}</>
}
