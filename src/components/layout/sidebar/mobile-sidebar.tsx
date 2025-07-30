'use client'

import { Sidebar } from '@/components/layout/sidebar/index'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

function MobileSidebar() {
  // STATE
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // EFFECT
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='icon' variant='secondary' className='lg:hidden'>
          <MenuIcon className='size-4 text-neutral-500' />
        </Button>
      </SheetTrigger>
      <SheetContent className='p-0' side='left'>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
