import { getCurrentAction } from '@/features/auth/actions'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const user = await getCurrentAction()

  if (!user.success || !user.data) {
    return redirect('/')
  }

  return (
    <div className='w-full lg:max-w-xl mx-auto'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold'>Profile</h1>
          <p className='text-muted-foreground'>Manage your profile settings</p>
        </div>
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Name</label>
            <p className='text-sm text-muted-foreground'>{user.data.name}</p>
          </div>
          <div>
            <label className='text-sm font-medium'>Email</label>
            <p className='text-sm text-muted-foreground'>{user.data.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
