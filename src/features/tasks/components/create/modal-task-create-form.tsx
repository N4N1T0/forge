'use client'

import ResponsiveDrawer from '@/components/ui/drawer/responsive-drawer'
import { TaskCreateForm } from '@/features/tasks'
import { ResponsiveModalProps } from '@/types'
import { useState } from 'react'

export const ModalTaskCreateForm = ({
  children,
  className
}: ResponsiveModalProps) => {
  // HOOKS
  const [isOpen, setIsOpen] = useState(false)

  // HANDLERS
  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)} className={className}>
        {children}
      </div>
      <ResponsiveDrawer
        onOpenChange={setIsOpen}
        open={isOpen}
        className={className}
        hideHeader={true}
        title='Create Task'
        description='Create a new task to keep track of your work'
      >
        <TaskCreateForm onCancel={handleClose} />
      </ResponsiveDrawer>
    </>
  )
}
