'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer/drawer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/modal/dialog'
import { useMedia } from '@/hooks/use-media'
import { cn } from '@/lib/utils'
import * as React from 'react'

interface ResponsiveModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  className?: string
  hideHeader?: boolean
}

export function ResponsiveModal({
  children,
  open = false,
  onOpenChange,
  title,
  description,
  className,
  hideHeader = false
}: ResponsiveModalProps) {
  const isDesktop = useMedia('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn('sm:max-w-[425px] p-0', className)}
          showCloseButton={false}
        >
          <DialogHeader className={hideHeader ? 'sr-only' : ''}>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn('max-h-[90vh] p-0', className)}>
        <DrawerHeader className={hideHeader ? 'sr-only' : ''}>
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className='my-auto'>{children}</div>
      </DrawerContent>
    </Drawer>
  )
}

export default ResponsiveModal
