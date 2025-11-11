'use client'

import { ThemeSwitcher } from '@/components/layout/navbar/theme-switcher'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCurrentProject } from '@/features/projects/hooks/use-project-id'
import { ModalTaskCreateForm } from '@/features/tasks/components/create'
import { useGetCurrentWorkspace } from '@/features/workspaces/hooks/use-workspace-id'
import { Plus } from 'lucide-react'

export const Navbar = () => {
  // HOOKS
  const { workspace, isLoading: isWorkspaceLoading } = useGetCurrentWorkspace()
  const { project, isLoading: isProjectLoading } = useGetCurrentProject()

  // CONST
  const loading = isProjectLoading || isWorkspaceLoading

  // RENDER
  if (workspace === null) {
    return null
  }

  // RENDER
  if (loading) {
    return (
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full px-4'>
        <Skeleton className='size-4 aspect-square' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-24' />
      </header>
    )
  }

  // RENDER
  return (
    <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full sticky top-0 bg-background border-b z-50'>
      <div className='flex items-center gap-2 px-4 w-full justify-between'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          {project ? project.name : workspace?.name}
        </div>
        <div className='flex justify-center items-center gap-2'>
          {project && (
            <ModalTaskCreateForm>
              <Button size='icon'>
                <Plus />
              </Button>
            </ModalTaskCreateForm>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
