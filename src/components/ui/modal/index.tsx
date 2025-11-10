'use client'

import { useRouter } from 'next/navigation'
import { ResponsiveModal } from './responsive-modal'

interface ModalProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function Modal({ children, title, description, className }: ModalProps) {
  const router = useRouter()

  return (
    <ResponsiveModal
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
      }}
      title={title}
      description={description}
      className={className}
    >
      {children}
    </ResponsiveModal>
  )
}
