'use client'

import { ResponsiveModal } from '@/components/ui/modal/responsive-modal'
import { useTaskEditModal } from '@/features/tasks/hooks/use-task-edit-modal'
import { ResponsiveModalProps } from '@/types'
import { Tasks } from '@/types/appwrite'
import { TaskEditForm } from './task-edit-form'

interface ModalTaskFormProps extends Omit<ResponsiveModalProps, 'children'> {
  task: Tasks
}

export const ModalTaskEditForm = ({ className, task }: ModalTaskFormProps) => {
  // HOOKS
  const { isOpen, handleClose } = useTaskEditModal()

  return (
    <ResponsiveModal
      onOpenChange={handleClose}
      open={isOpen ?? false}
      className={className}
      hideHeader={true}
      title='Edit Task'
      description='Edit the task details'
    >
      <TaskEditForm onCancel={handleClose} task={task} />
    </ResponsiveModal>
  )
}
