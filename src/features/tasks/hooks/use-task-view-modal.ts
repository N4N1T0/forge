import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs'

export const useTaskViewModal = () => {
  // HOOKS
  const [isOpen, setIsOpen] = useQueryState('taskViewModal', parseAsBoolean)
  const [taskId, setTaskId] = useQueryState('taskId', parseAsString)

  // HANDLERS
  const handleClose = () => {
    setIsOpen(false)
    setTaskId(null)
  }
  const handleOpen = (id?: string) => {
    if (id) setTaskId(id)
    setIsOpen(true)
  }

  return {
    isOpen,
    taskId,
    handleClose,
    handleOpen
  }
}
