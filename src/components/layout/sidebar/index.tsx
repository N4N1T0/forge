import SidebarNavigation from '@/components/layout/sidebar/sidebar-navigation'
import { Separator } from '@/components/ui/separator'
import { WorkspaceSwitcher } from '@/features/workspaces/components/workspace-switcher'
import Link from 'next/link'

export const Sidebar = () => {
  return (
    <aside className='h-full bg-neutral-100 p-4 w-full'>
      <Link
        href='/dashboard'
        className='text-3xl font-bold text-primary w-full items-center flex justify-center font-display'
      >
        THE FORGE
      </Link>
      <Separator variant='dashed' className='my-4' />
      <WorkspaceSwitcher />
      <Separator variant='dashed' className='my-4' />
      <SidebarNavigation />
    </aside>
  )
}
