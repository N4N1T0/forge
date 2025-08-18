import { getCurrentAction } from '@/features/auth/actions'
import { redirect } from 'next/navigation'

export default async function WorkspacePage({ params }: WorkspaceIdProps) {
  const data = await getCurrentAction()
  const { workspaceId } = await params

  if (!data.success || !data.data) {
    return redirect('/')
  }

  return <>WorkspacePage - {workspaceId}</>
}
