import { getCurrent } from '@/features/auth/actions'
import { UserBtn } from '@/features/auth/components/user-btn'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  // STATE
  const { data: user } = await getCurrent()

  // REDIRECT
  if (!user) redirect('/')

  return (
    <div>
      <UserBtn />
    </div>
  )
}
