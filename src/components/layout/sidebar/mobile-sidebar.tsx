'use client'

import { Sidebar } from '@/components/layout/sidebar/index'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
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
        <Button size='icon' variant='outline' className='lg:hidden'>
          <MenuIcon className='size-4' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader className='sr-only'>
          <SheetTitle>Forge Sidebar</SheetTitle>
          <SheetDescription>
            Navigate through the Forge application.
          </SheetDescription>
        </SheetHeader>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
