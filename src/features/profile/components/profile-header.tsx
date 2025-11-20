'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

// TYPES
interface ProfileHeaderProps {
  name: string
  email: string
}

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
  // CONST
  const initials = getInitials(name)

  return (
    <div className='flex items-center gap-4 col-span-1 md:col-span-5 border-b pb-4'>
      <Avatar className='size-16'>
        <AvatarFallback className='text-lg'>{initials}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold'>{name}</h1>
        <p className='text-muted-foreground text-sm'>{email}</p>
      </div>
    </div>
  )
}
