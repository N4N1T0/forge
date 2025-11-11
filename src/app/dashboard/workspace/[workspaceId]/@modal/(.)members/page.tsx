import { Drawer } from '@/components/ui/drawer'
import { getCurrentAction } from '@/features/auth/actions'
import MembersList from '@/features/members/components/members-list'
import { redirect } from 'next/navigation'

export default async function MembersModal() {
  const user = await getCurrentAction()

  if (!user.success || !user.data) {
    return redirect('/')
  }

  return (
    <Drawer
      title='Members'
      description='Manage your workspace members'
      hideHeader
      side='left'
    >
      <div className='w-full lg:max-w-xl mx-auto p-6'>
        <MembersList />
      </div>
    </Drawer>
  )
}
