'use client'

import {
  DangerZone,
  PasswordChangeForm,
  ProfileHeader,
  ProfileInfoForm,
  WorkspaceList
} from '@/features/profile/components'
import { useGetProfile } from '@/features/profile/hooks/use-get-profile'
import { Loader } from 'lucide-react'

export default function ProfilePage() {
  // HOOKS - PROFILE DATA
  const { data: profile, isLoading } = useGetProfile()

  // RENDER
  if (isLoading) {
    return (
      <div className='w-full max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]'>
        <Loader className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='w-full max-w-4xl mx-auto p-6'>
        <p className='text-center text-muted-foreground'>
          No se pudo cargar el perfil
        </p>
      </div>
    )
  }

  return (
    <div className='size-full max-w-7xl grid grid-cols-5 px-5 gap-5 py-10'>
      <ProfileHeader name={profile.name} email={profile.email} />
      <ProfileInfoForm initialName={profile.name} initialBio={profile.bio} />
      <div className='col-span-1 md:col-span-2 flex flex-col gap-4'>
        <PasswordChangeForm email={profile.email} />
        <DangerZone userEmail={profile.email} />
      </div>
      <WorkspaceList />
    </div>
  )
}
