import { Navbar } from '@/components/layout/navbar'
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: Layouts) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main className='flex flex-col size-full justify-center items-center overflow-y-auto py-4'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
