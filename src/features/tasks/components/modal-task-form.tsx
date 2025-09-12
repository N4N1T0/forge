'use client'

import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { ResponsiveModalProps } from '@/types'
import { useState } from 'react'
import { CreateTaskForm } from './task-form'

interface ModalTaskFormProps extends ResponsiveModalProps {
  projectId: string
}

const ModalTaskForm = ({
  children,
  className,
  projectId
}: ModalTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false)

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
        <CreateTaskForm onCancel={handleClose} projectId={projectId} />
      </ResponsiveModal>
    </>
  )
}

export default ModalTaskForm
