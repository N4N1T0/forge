'use client'

import ResponsiveDrawer from '@/components/ui/drawer/responsive-drawer'
import { TaskEditForm, useTaskEditModal } from '@/features/tasks'
import { ResponsiveModalProps } from '@/types'
import { Tasks } from '@/types/appwrite'
import { ReactNode } from 'react'

// TYPES
interface ModalTaskFormProps extends Omit<ResponsiveModalProps, 'children'> {
  task: Tasks
  children?: ReactNode
}

export const ModalTaskEditForm = ({
  className,
  task,
  children
}: ModalTaskFormProps) => {
  // HOOKS
  const { isOpen, taskId, handleClose, handleOpen } = useTaskEditModal()

  return (
    <>
      {children && (
        <div onClick={() => handleOpen(task.$id)} className={className}>
          {children}
        </div>
      )}
      <ResponsiveDrawer
        onOpenChange={handleClose}
        open={Boolean(isOpen && taskId === task.$id)}
        className={className}
        hideHeader={true}
        title='Edit Task'
        description='Edit the task details'
      >
        <TaskEditForm onCancel={handleClose} task={task} />
      </ResponsiveDrawer>
    </>
  )
}
