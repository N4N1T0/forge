'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer/drawer'
import { useMedia } from '@/hooks/use-media'
import { cn } from '@/lib/utils'
import * as React from 'react'

export interface ResponsiveDrawerProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  className?: string
  hideHeader?: boolean
  side?: 'left' | 'right'
}

export function ResponsiveDrawer({
  children,
  open = false,
  onOpenChange,
  title,
  description,
  className,
  hideHeader = false,
  side = 'right'
}: ResponsiveDrawerProps) {
  // HOOKS
  const isDesktop = useMedia('(min-width: 768px)')
  const direction = isDesktop ? side : 'top'

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerContent
        className={cn(
          isDesktop
            ? `data-[vaul-drawer-direction=left]:sm:max-w-fit data-[vaul-drawer-direction=right]:sm:max-w-fit`
            : 'max-h-[90vh] p-0',
          className
        )}
      >
        <DrawerHeader className={hideHeader ? 'sr-only' : ''}>
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className={isDesktop ? 'h-full' : 'my-auto'}>{children}</div>
      </DrawerContent>
    </Drawer>
  )
}

export default ResponsiveDrawer
