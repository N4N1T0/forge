import { getWorkspacesAction } from '@/features/workspaces/actions'
import { redirect } from 'next/navigation'

export default async function Page() {
  const workspaces = await getWorkspacesAction()

  if (
    !workspaces.success ||
    !workspaces.data ||
    workspaces.data?.length === 0
  ) {
    return redirect('/create')
  }

  redirect(`/dashboard/workspace/${workspaces.data[0].$id}`)
}
