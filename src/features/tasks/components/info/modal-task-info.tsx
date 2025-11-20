'use client'

import ResponsiveDrawer from '@/components/ui/drawer/responsive-drawer'
import { TaskEditForm, TaskInfoView, useTaskViewModal } from '@/features/tasks'
import { ResponsiveModalProps } from '@/types'
import { Tasks } from '@/types/appwrite'
import { ReactNode, useState } from 'react'

// TYPES
interface ModalTaskInfoProps extends Omit<ResponsiveModalProps, 'children'> {
  task: Tasks | undefined
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

  // RENDER
  if (!task) {
    return null
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
