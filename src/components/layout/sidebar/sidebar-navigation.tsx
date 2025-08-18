'use client'

import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/data'
import { useWorkspaceId } from '@/features/workspaces/client/use-workspace-id'
import Link from 'next/link'

export default function SidebarNavigation() {
  const workspaceId = useWorkspaceId()

  return (
    <ul className='flex flex-col gap-3'>
      {routes.map(({ href, icon, name }) => {
        const isActive = false
        const Icon = icon
        const formattedHref = `/dashboard/workspace/${workspaceId}/${href}`

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
