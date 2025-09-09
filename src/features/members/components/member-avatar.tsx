import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import { Members } from '@/types/appwrite'
import { Models } from 'node-appwrite'

export interface MemberAvatarProps {
  member: Members & Models.User<Models.Preferences>
  className?: string
  fallbackClassName?: string
}

export const MemberAvatar = ({ member, className }: MemberAvatarProps) => {
  // CONST
  const { name } = member
  const initials = getInitials(name)
  return (
    <Avatar className={cn('size-10', className)}>
      {/* TODO: {prefs && prefs?.avatar && <AvatarImage src={prefs?.avatar} />} */}
      <AvatarFallback className='bg-primary text-background text-lg uppercase border border-background'>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
