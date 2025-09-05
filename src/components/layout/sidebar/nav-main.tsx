'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { routes } from '@/data'
import { useWorkspaceId } from '@/features/workspaces/client/use-workspace-id'
import Link from 'next/link'

export function NavMain() {
  // HOOKS
  const workspaceId = useWorkspaceId()

  // RENDERS
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {routes.map(({ href, icon, name }) => {
          const isActive = false
          const Icon = icon
          const formattedHref = `/dashboard/workspace/${workspaceId}${href}`

          return (
            <SidebarMenuButton
              tooltip={name}
              key={name}
              isActive={isActive}
              asChild
            >
              <Link href={formattedHref} className={isActive ? 'active' : ''}>
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
