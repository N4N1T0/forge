'use client'

import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Loader, LogOut } from 'lucide-react'
import { useCurrent } from '../server/use-current'
import { useLogout } from '../server/use-logout'

export const UserBtn = () => {
  // STATE
  const { mutate: logOut } = useLogout()
  const { data: user, isLoading } = useCurrent()

  // CONST
  const avatarFallback =
    user?.name?.slice(0, 1).toUpperCase() ||
    user?.email?.slice(0, 1).toUpperCase()

  if (isLoading) {
    return (
      <div className='size-10 rounded-full flex justify-center items-center bg-primary border border-border transition-all duration-200'>
        <Loader className='size-4 animate-spin text-white' />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='outline-none relative'>
        <Avatar className='size-10 transition-all duration-200 border border-border cursor-pointer hover:border-primary/50 hover:shadow-sm'>
          <AvatarFallback className='bg-primary text-white flex justify-center items-center size-full font-medium'>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        side='bottom'
        className='w-64 p-0'
        sideOffset={10}
      >
        <div className='flex justify-center items-center gap-3 px-4 py-4'>
          <Avatar className='size-16 transition-all duration-200 border border-border shadow-sm'>
            <AvatarFallback className='bg-primary text-white flex justify-center items-center size-full font-semibold text-lg'>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className='flex-col flex justify-center items-center space-y-1'>
            <p className='text-sm font-semibold text-foreground'>
              {user?.name || 'Usuario'}
            </p>
            <p className='text-xs text-muted-foreground'>{user?.email}</p>
          </div>
        </div>
        <Separator variant='dashed' className='mx-2' />
        <div className='p-2'>
          <DropdownMenuItem
            onClick={() => logOut()}
            className='h-11 flex items-center justify-center text-destructive font-medium cursor-pointer rounded-md transition-all duration-200 hover:bg-destructive/10 focus:bg-destructive/10'
          >
            <LogOut className='size-4 mr-2' /> Cerrar Sesión
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
