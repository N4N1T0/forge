import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export const WorkspaceAvatar = ({
  workspace,
  className
}: WorkspaceAvatarProps) => {
  const { imageUrl, name } = workspace

  if (imageUrl) {
    return (
      <div
        className={cn(
          'relative size-10 rounded-full overflow-hidden border border-background',
          className
        )}
      >
        <Image
          src={imageUrl}
          alt={name}
          className='object-cover size-full'
          fill
        />
      </div>
    )
  }

  return (
    <Avatar className={cn('size-10', className)}>
      <AvatarFallback className='bg-primary text-background text-lg uppercase border border-background rounded-full'>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
