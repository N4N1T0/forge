'use client'

import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

import ResponsiveModal from '@/components/ui/modal/responsive-modal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ResponsiveModalProps } from '@/types'
import { Projects } from '@/types/appwrite'
import CardDeleteProject from './card-delete-project'
import EditarProyectoForm from './project-edit-form'

interface ModalProjectConfigProps extends ResponsiveModalProps {
  project: Projects
}

const ModalProjectConfig = ({
  children,
  project,
  className
}: ModalProjectConfigProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setActiveTab('edit'), 200)
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)} className={className}>
        {children}
      </div>
      <ResponsiveModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title='Project Settings'
        description='Manage your project settings and configuration'
        className='max-w-3xl bg-muted'
        hideHeader={true}
      >
        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full gap-0'
          >
            <TabsList className='grid w-full grid-cols-2 h-12'>
              <TabsTrigger value='edit' className='flex items-center gap-2'>
                <Edit className='size-4' />
                Edit Project
              </TabsTrigger>
              <TabsTrigger value='delete' className='flex items-center gap-2'>
                <Trash2 className='size-4' />
                Delete Project
              </TabsTrigger>
            </TabsList>

            <TabsContent value='edit'>
              <EditarProyectoForm
                initialValues={project}
                onCancel={handleClose}
              />
            </TabsContent>

            <TabsContent value='delete'>
              <CardDeleteProject project={project} onCancel={handleClose} />
            </TabsContent>
          </Tabs>
        </div>
      </ResponsiveModal>
    </>
  )
}

export default ModalProjectConfig
