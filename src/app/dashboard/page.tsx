import { getWorkspaces } from '@/features/workspaces/actions'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const workspaces = await getWorkspaces()

  if (
    !workspaces.success ||
    !workspaces.data ||
    workspaces.data?.length === 0
  ) {
    return redirect('/dashboard/workspace/create')
  }

  redirect(`/dashboard/workspace/${workspaces.data[0].$id}`)
}
