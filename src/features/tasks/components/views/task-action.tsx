'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { status } from '@/data'
import {
  ModalTaskEditForm,
  ModalTaskInfo,
  useChangeTaskStatus,
  useDeleteTask,
  useTaskEditModal,
  useTaskViewModal
} from '@/features/tasks'
import { useConfirm } from '@/hooks/use-confirm'
import { Status, Tasks } from '@/types/appwrite'

// TYPES
interface TaskActionProps {
  task: Tasks
  children: React.ReactNode
  showStatus?: boolean
}

export const TaskAction = ({
  task,
  children,
  showStatus = true
}: TaskActionProps) => {
  // HOOKS
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const { handleOpen: handleOpenEditModal } = useTaskEditModal()
  const { handleOpen: handleOpenViewModal } = useTaskViewModal()
  const { mutate: changeStatus, isPending: isChangingStatus } =
    useChangeTaskStatus()
  const [confirmDelete, DeleteWorkspaceModal] = useConfirm(
    'Delete task',
    'this task will be deleted',
    'destructive'
  )

  // HANDLERS
  const handleDelete = async () => {
    const ok = await confirmDelete()
    if (!ok) return

    if (task) {
      deleteTask({
        param: {
          taskId: task.$id
        }
      })
    }
  }

  const handleStatusChange = (newStatus: Status) => {
    if (newStatus !== task.status) {
      changeStatus({
        json: { status: newStatus },
        param: { taskId: task.$id }
      })
    }
  }

  // CONST
  const isLoading = isDeleting || isChangingStatus

  return (
    <div className='flex justify-start'>
      {/* MODALS */}
      <DeleteWorkspaceModal />
      <ModalTaskEditForm task={task} />
      <ModalTaskInfo task={task} />

      {/* DROPDOWN MENU */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            disabled={isLoading}
            className='font-medium p-2'
            onClick={() => handleOpenViewModal(task.$id)}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isLoading}
            className='font-medium p-2'
            onClick={() => handleOpenEditModal(task.$id)}
          >
            Edit
          </DropdownMenuItem>
          {showStatus && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={task.status}>
                  {status.map(({ label, value, color }) => (
                    <DropdownMenuRadioItem
                      key={value}
                      value={value}
                      circleColor={color}
                      onClick={() => handleStatusChange(value as Status)}
                      disabled={isLoading}
                    >
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isLoading}
            variant='destructive'
            className='font-medium p-2'
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
