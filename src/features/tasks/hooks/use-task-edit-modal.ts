import { parseAsBoolean, useQueryState } from 'nuqs'

export const useTaskEditModal = () => {
  // HOOKS
  const [isOpen, setIsOpen] = useQueryState('taskEditModal', parseAsBoolean)

  // HANDLERS
  const handleClose = () => {
    setIsOpen(false)
  }
  const handleOpen = () => {
    setIsOpen(true)
  }

  return {
    isOpen,
    handleClose,
    handleOpen
  }
}
