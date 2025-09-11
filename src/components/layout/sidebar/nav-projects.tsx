'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import ModalProjectForm from '@/features/projects/components/modal-project-form'
import { useGetProjects } from '@/features/projects/server/use-get-projects'
import { useGetCurrentWorkspace } from '@/features/workspaces/client/use-workspace-id'
import { Command, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Projects() {
  // HOOKS
  const pathname = usePathname()
  const { workspace } = useGetCurrentWorkspace()
  const { data: projects, isLoading } = useGetProjects(workspace?.$id || '')

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 3 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton className='p-0 px-2 py-1'>
                <Skeleton className='h-6 w-full' />
                <Skeleton className='size-6' />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Projects
        <ModalProjectForm className='ml-auto'>
          <SidebarMenuButton
            className='size-6 flex justify-center items-center aspect-square'
            variant='outline'
          >
            <Plus className='size-3' />
            <span className='sr-only'>Create project</span>
          </SidebarMenuButton>
        </ModalProjectForm>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects?.rows.map(({ $id, name, shortcut }) => {
          const href = `/dashboard/workspace/${workspace?.$id}/projects/${$id}`
          const isActive = pathname.includes(href)

          return (
            <SidebarMenuItem key={$id}>
              <SidebarMenuButton asChild>
                <Link href={href} className={isActive ? 'bg-muted' : ''}>
                  <span>{name}</span>
                  {shortcut && (
                    <span className='text-sm text-muted-foreground ml-auto flex uppercase gap-1 justify-center items-center'>
                      <Command className='size-3' /> {shortcut}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
