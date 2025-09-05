import { getCurrentAction } from '@/features/auth/actions'
import MembersList from '@/features/members/components/members-list'
import { redirect } from 'next/navigation'

export default async function MemberPage() {
  const user = await getCurrentAction()

  if (!user.success || !user.data) {
    return redirect('/')
  }

  return (
    <div className='w-full lg:max-w-xl mx-auto'>
      <MembersList />
    </div>
  )
}
