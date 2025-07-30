import { buttonVariants } from '@/components/ui/button'
import { ClipboardCheck, HouseIcon, Settings, UsersIcon } from 'lucide-react'
import Link from 'next/link'

const routes = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HouseIcon
  },
  {
    name: 'Tareas',
    href: '/tasks',
    icon: ClipboardCheck
  },
  {
    name: 'Ajustes',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Miembros',
    href: '/members',
    icon: UsersIcon
  }
]

export default function SidebarNavigation() {
  return (
    <ul className='flex flex-col gap-3'>
      {routes.map((route) => {
        const isActive = false
        const Icon = route.icon

        return (
          <li key={route.name} className='cursor-pointer'>
            <Link
              href={route.href}
              data-active={isActive}
              className={buttonVariants({
                variant: 'ghost',
                className:
                  'w-full justify-start hover:text-primary hover:bg-transparent data-[active=true]:bg-primary data-[active=true]:text-white',
                size: 'sm'
              })}
            >
              <Icon className='size-5' />
              {route.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
