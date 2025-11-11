'use client'

import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectShortcuts } from '@/features/projects/hooks/use-project-shortcuts'
import { useGetProjects } from '@/features/projects/server/use-get-projects'
import { useGetCurrentWorkspace } from '@/features/workspaces/hooks/use-workspace-id'
import { Command, Folder } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavProjectCreate } from './nav-projects-create'

export function Projects() {
  // HOOKS
  const pathname = usePathname()
  const { workspace, isLoading: isLoadingWorkspace } = useGetCurrentWorkspace()
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId: workspace?.$id || ''
  })

  // KBD HOOKS
  useProjectShortcuts({ projects: projects?.rows, workspaceId: workspace?.$id })

  if (isLoadingWorkspace || isLoadingProjects) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              className='flex h-8 items-center gap-2 rounded-md px-2'
              key={index}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects?.rows.map(({ $id, name, shortcut }) => {
          const href = `/dashboard/workspace/${workspace?.$id}/projects/${$id}`
          const isActive = pathname.includes(href)

          return (
            <SidebarMenuItem key={$id}>
              <SidebarMenuButton
                asChild
                tooltip={`Project: ${name}`}
                isActive={isActive}
              >
                <Link href={href} className={isActive ? 'bg-muted' : ''}>
                  <Folder className='size-3' />
                  <span className='truncate'>{name}</span>
                  {shortcut && (
                    <KbdGroup className='text-sm text-muted-foreground ml-auto flex uppercase gap-1 justify-center items-center'>
                      <Kbd>
                        <Command className='size-3' />
                      </Kbd>
                      <Kbd>{shortcut}</Kbd>
                    </KbdGroup>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
        <NavProjectCreate />
      </SidebarMenu>
    </SidebarGroup>
  )
}
