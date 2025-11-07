'use client'

import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/data'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SidebarNavigation() {
  const workspaceId = useWorkspaceId()
  const pathname = usePathname()

  return (
    <ul className='flex flex-col gap-3'>
      {routes.map(({ href, icon, name }) => {
        const formattedHref = `/dashboard/workspace/${workspaceId}${href}`
        const isActive = pathname === formattedHref
        const Icon = icon

        return (
          <li key={name} className='cursor-pointer'>
            <Link
              href={formattedHref}
              data-active={isActive}
              className={buttonVariants({
                variant: 'ghost',
                className:
                  'w-full justify-start hover:text-primary hover:bg-transparent data-[active=true]:bg-primary data-[active=true]:text-primary',

                size: 'sm'
              })}
            >
              <Icon className='size-5' />
              {name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
