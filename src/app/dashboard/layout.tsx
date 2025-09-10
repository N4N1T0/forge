import { Navbar } from '@/components/layout/navbar'
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar'
import { SpacemanThemeProviderClient } from '@/components/layout/spaceman-theme-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Layouts } from '@/types'

export default function DashboardLayout({ children }: Layouts) {
  return (
    <SpacemanThemeProviderClient
      themes={['light', 'dark', 'system']}
      defaultTheme='system'
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main className='flex flex-col size-full justify-center items-center overflow-y-auto py-4'>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SpacemanThemeProviderClient>
  )
}
