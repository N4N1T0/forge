import { getCurrentAction } from '@/features/auth/actions'
import { MembersList } from '@/features/members/components'
import { redirect } from 'next/navigation'

export default async function MemberPage() {
  const user = await getCurrentAction()

  if (!user.success || !user.data) {
    return redirect('/')
  }

  return (
    <section
      id='workspace-members'
      className='size-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'
    >
      <MembersList />
    </section>
  )
}
