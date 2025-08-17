import { ModeToggle } from '@/components/layout/navbar/theme-switcher'
import MobileSidebar from '@/components/layout/sidebar/mobile-sidebar'
import { UserBtn } from '@/features/auth/components/user-btn'

export const Navbar = () => {
  return (
    <nav className='pt-4 px-6 flex items-center justify-between w-full'>
      <div className='flex-col hidden lg:flex'>
        <h1 className='text-2xl font-semibold'> Dashboard </h1>
        <p className='text-muted-foreground'>
          A platform for Ohmu to manage their online operations
        </p>
      </div>
      <MobileSidebar />
      <div className='flex items-center gap-2'>
        <UserBtn />
        <ModeToggle />
      </div>
    </nav>
  )
}
