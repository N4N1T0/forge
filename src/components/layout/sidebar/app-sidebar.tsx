'use client'

import * as React from 'react'

import { NavMain } from '@/components/layout/sidebar/nav-main'
import { NavUser } from '@/components/layout/sidebar/nav-user'
import { WorkspaceSwitcher } from '@/components/layout/sidebar/workspace-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { Projects } from './nav-projects'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <span className='border-b uppercase font-serif text-xl py-2 px-1 mt-2.5'>
          THE FORGE
        </span>
      </SidebarHeader>
      <SidebarContent>
        <WorkspaceSwitcher />
        <NavMain />
        <Projects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
