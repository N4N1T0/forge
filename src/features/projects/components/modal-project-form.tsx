'use client'

import ResponsiveDrawer from '@/components/ui/drawer/responsive-drawer'
import { ResponsiveModalProps } from '@/types'
import { useEffect, useState } from 'react'
import { CreateProjectForm } from '.'

export function ModalProjectForm({
  children,
  className
}: ResponsiveModalProps) {
  // STATE
  const [isOpen, setIsOpen] = useState(false)

  // EFFECT (Listen to global event to open via keyboard: Cmd/Ctrl + +)
  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener(
      'forge:open-create-project',
      handler as EventListener
    )
    return () =>
      window.removeEventListener(
        'forge:open-create-project',
        handler as EventListener
      )
  }, [])

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
        open={isOpen}
        onOpenChange={setIsOpen}
        title='Create Project'
        description='Create a new project to organize your work'
        className='sm:max-w-2xl'
        hideHeader={true}
      >
        <CreateProjectForm onCancel={handleClose} />
      </ResponsiveDrawer>
    </>
  )
}

export default ModalProjectForm
