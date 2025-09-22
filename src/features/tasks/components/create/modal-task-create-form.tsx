'use client'

import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { ResponsiveModalProps } from '@/types'
import { useState } from 'react'
import { TaskCreateForm } from './task-create-form'

// TYPES
interface ModalTaskFormProps extends ResponsiveModalProps {
  projectId: string
}

export const ModalTaskCreateForm = ({
  children,
  className,
  projectId
}: ModalTaskFormProps) => {
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
      <ResponsiveModal
        onOpenChange={setIsOpen}
        open={isOpen}
        className={className}
        hideHeader={true}
        title='Create Task'
        description='Create a new task to keep track of your work'
      >
        <TaskCreateForm onCancel={handleClose} projectId={projectId} />
      </ResponsiveModal>
    </>
  )
}
