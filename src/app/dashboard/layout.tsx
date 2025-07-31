import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({ children }: Layouts) {
  return (
    <div className='h-screen size-full overflow-y-hidden'>
      <div className='flex size-full'>
        <div className='fixed left-0 top-0 hidden lg:block lg:w-64 overflow-y-auto h-full'>
          <Sidebar />
        </div>
        <div className='lg:pl-64 w-full'>
          <div className='mx-auto max-w-screen-2xl h-full'>
            <Navbar />
            <main className='size-full py-8 px-6 flex flex-col justify-center items-center'>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
