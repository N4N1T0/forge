'use client'

import ResponsiveDrawer from '@/components/ui/drawer/responsive-drawer'
import { Separator } from '@/components/ui/separator'
import { ResponsiveModalProps } from '@/types'
import { Projects } from '@/types/appwrite'
import { useState } from 'react'
import ProjectDeleteDangerZone from './project-delete-danger-zone'
import EditarProyectoForm from './project-edit-form'

interface ModalProjectConfigProps extends ResponsiveModalProps {
  project: Projects
}

const ModalProjectConfig = ({
  children,
  project,
  className
}: ModalProjectConfigProps) => {
  // STATE
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
        open={isOpen}
        onOpenChange={setIsOpen}
        title='Project Settings'
        description='Manage your project settings and configuration'
        className='sm:max-w-3xl'
        hideHeader={true}
      >
        {/* EDIT */}
        <EditarProyectoForm initialValues={project} onCancel={handleClose} />

        <Separator className='bg-muted/50 my-2' />

        {/* DELETE */}
        <ProjectDeleteDangerZone project={project} onCancel={handleClose} />
      </ResponsiveDrawer>
    </>
  )
}

export default ModalProjectConfig
