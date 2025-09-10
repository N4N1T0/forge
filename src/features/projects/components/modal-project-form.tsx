'use client'

import ResponsiveModal from '@/components/ui/responsive-modal'
import { useState } from 'react'
import CreateProjectForm from './project-form'

interface ModalProjectFormProps {
  children: React.ReactNode
  className?: string
}

export function ModalProjectForm({
  children,
  className
}: ModalProjectFormProps) {
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
        open={isOpen}
        onOpenChange={setIsOpen}
        title='Create Project'
        description='Create a new project to organize your work'
        className='max-w-2xl'
        hideHeader={true}
      >
        <CreateProjectForm onCancel={handleClose} />
      </ResponsiveModal>
    </>
  )
}

export default ModalProjectForm
