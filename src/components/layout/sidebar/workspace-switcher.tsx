'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ResponsiveModal from '@/components/ui/responsive-modal'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkspaceId } from '@/features/workspaces/client/use-workspace-id'
import CreateWorkspacesForm from '@/features/workspaces/components/workspace-form'
import { useGetWorkspaces } from '@/features/workspaces/server/use-current-workspace'
import { Workspaces } from '@/types/appwrite'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export function TeamSwitcher() {
  // STATE
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { data: workspaces, isLoading } = useGetWorkspaces()
  const workspaceId = useWorkspaceId()
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<
    Workspaces | undefined
  >(workspaces?.[0])

  // EFFECT
  React.useEffect(() => {
    setSelectedWorkspace(
      workspaces?.find((workspace) => workspace.$id === workspaceId)
    )
  }, [workspaces, workspaceId])

  // HANDLER
  const handlerOnselect = (value: string) => {
    setSelectedWorkspace(
      workspaces?.find((workspace) => workspace.$id === value)
    )
    router.push(`/dashboard/workspace/${value}`)
  }

  if (isLoading) {
    return (
      <div className='flex w-full gap-2 px-2 py-1 items-center'>
        <Skeleton className='aspect-square size-8' />
        <div className='h-full flex-1 flex flex-col gap-1'>
          <Skeleton className='h-4 w-full max-w-32' />
          <Skeleton className='h-3 w-full max-w-24' />
        </div>
        <Skeleton className='h-1/2 w-2' />
      </div>
    )
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <DynamicIcon
                    name={(selectedWorkspace?.icon as IconName) ?? 'folder'}
                    className='size-4'
                    key={selectedWorkspace?.icon}
                  />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {selectedWorkspace?.name}
                  </span>
                  <span className='truncate text-xs line-clamp-1 text-muted-foreground'>
                    {selectedWorkspace?.description}
                  </span>
                </div>
                <ChevronsUpDown className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-40 rounded-lg'
              align='start'
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className='text-muted-foreground text-xs'>
                Workspaces
              </DropdownMenuLabel>
              {workspaces?.map(({ icon, name, $id }) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => handlerOnselect($id)}
                  className='gap-2 p-2'
                >
                  <div className='flex size-7 items-center justify-center rounded-md border'>
                    <DynamicIcon
                      name={(icon as IconName) ?? 'folder'}
                      className='size-4 shrink-0'
                    />
                  </div>
                  {name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='gap-2 p-2'
                onClick={() => setIsOpen(true)}
              >
                <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                  <Plus className='size-4' />
                </div>
                <div className='text-muted-foreground font-medium'>
                  Add workspace
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <ResponsiveModal
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title='Create a new workspace'
        description='A responsive modal/vault for creating a new workspace'
        hideHeader={true}
      >
        <CreateWorkspacesForm onCancel={() => setIsOpen(false)} />
      </ResponsiveModal>
    </>
  )
}
