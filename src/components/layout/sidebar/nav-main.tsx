'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { routes } from '@/data'
import { useWorkspaceId } from '@/features/workspaces'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavMain() {
  // HOOKS
  const workspaceId = useWorkspaceId()
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {routes.map(({ href, icon, name }) => {
          const formattedHref = `/workspace/${workspaceId}${href}`
          const isActive =
            href === '/workspace'
              ? pathname === formattedHref
              : pathname.startsWith(formattedHref)
          const Icon = icon

          return (
            <SidebarMenuButton
              tooltip={name}
              key={name}
              isActive={isActive}
              asChild
            >
              <Link href={formattedHref} className={isActive ? 'bg-muted' : ''}>
                {Icon && <Icon />}
                <span>{name}</span>
              </Link>
            </SidebarMenuButton>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
