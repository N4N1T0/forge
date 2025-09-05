'use client'

import { ThemeSwitcher } from '@/components/layout/navbar/theme-switcher'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCurrentWorkspace } from '@/features/workspaces/client/use-workspace-id'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  // HOOKS
  const { workspace, isLoading } = useGetCurrentWorkspace()
  const pathname = usePathname()

  // CONST
  const pathnameSegments = pathname
    .split('/')
    .filter((segment) => segment !== workspace?.$id)

  // RENDER
  if (workspace === null) {
    return null
  }

  // RENDER
  if (isLoading) {
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
    <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full sticky top-0 bg-background border-b'>
      <div className='flex items-center gap-2 px-4 w-full justify-between'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>{workspace?.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {pathnameSegments.length > 3
                    ? pathnameSegments[3]
                    : 'Dashboard'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ThemeSwitcher
          workspaceTheme={workspace?.theme}
          key={workspace?.theme}
        />
      </div>
    </header>
  )
}
