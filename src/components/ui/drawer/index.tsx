'use client'

import { useRouter } from 'next/navigation'
import { ResponsiveDrawer, ResponsiveDrawerProps } from './responsive-drawer'

type DrawerProps = Omit<ResponsiveDrawerProps, 'open' | 'onOpenChange'>

export function Drawer({
  children,
  title,
  description,
  className,
  side,
  hideHeader
}: DrawerProps) {
  const router = useRouter()

  return (
    <ResponsiveDrawer
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
      }}
      title={title}
      description={description}
      className={className}
      side={side}
      hideHeader={hideHeader}
    >
      {children}
    </ResponsiveDrawer>
  )
}
