'use client'

import ResponsiveDrawer from '@/components/ui/drawer/responsive-drawer'
import { ResponsiveModalProps } from '@/types'
import { Tasks } from '@/types/appwrite'
import { ReactNode, useState } from 'react'
import { useTaskViewModal } from '../../hooks/use-task-view-modal'
import { TaskEditForm } from '../edit'
import { TaskInfoView } from './task-info-view'

interface ModalTaskInfoProps extends Omit<ResponsiveModalProps, 'children'> {
  task: Tasks
  children?: ReactNode
}

export const ModalTaskInfo = ({
  children,
  className,
  task
}: ModalTaskInfoProps) => {
  // HOOKS
  const {
    isOpen,
    taskId,
    handleClose: handleCloseModal,
    handleOpen
  } = useTaskViewModal()
  const [isEdit, setIsEdit] = useState(false)

  // HANDLERS
  const handleClose = () => {
    handleCloseModal()
    setIsEdit(false)
  }

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
        title={isEdit ? 'Edit Task' : 'Task Details'}
        description={isEdit ? 'Edit task details' : 'View task details'}
      >
        {isEdit ? (
          <TaskEditForm
            task={task}
            onCancel={handleClose}
            setIsEdit={setIsEdit}
          />
        ) : (
          <TaskInfoView
            task={task}
            onCancel={handleClose}
            setIsEdit={setIsEdit}
          />
        )}
      </ResponsiveDrawer>
    </>
  )
}
