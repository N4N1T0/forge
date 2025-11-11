import { Drawer } from '@/components/ui/drawer'
import { getCurrentAction } from '@/features/auth/actions'
import { redirect } from 'next/navigation'

export default async function ProfileModal() {
  const user = await getCurrentAction()

  if (!user.success || !user.data) {
    return redirect('/')
  }

  return (
    <Drawer
      title='Profile'
      description='Manage your profile settings'
      hideHeader
      side='left'
    >
      <div className='p-6 space-y-4'>
        <div>
          <label className='text-sm font-medium'>Name</label>
          <p className='text-sm text-muted-foreground'>{user.data.name}</p>
        </div>
        <div>
          <label className='text-sm font-medium'>Email</label>
          <p className='text-sm text-muted-foreground'>{user.data.email}</p>
        </div>
      </div>
    </Drawer>
  )
}
