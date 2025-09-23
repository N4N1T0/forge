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
import { ModalTaskEditForm } from '@/features/tasks/components/edit'
import { useTaskEditModal } from '@/features/tasks/hooks/use-task-edit-modal'
import { useChangeTaskStatus } from '@/features/tasks/server/use-change-task-status'
import { useDeleteTask } from '@/features/tasks/server/use-delete-task'
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
  const { handleOpen } = useTaskEditModal()
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
  return (
    <div className='flex justify-start'>
      <DeleteWorkspaceModal />
      <ModalTaskEditForm task={task} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            disabled={false}
            onClick={() => handleOpen()}
            className='font-medium p-2'
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
                      disabled={isChangingStatus}
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
            disabled={isDeleting}
            className='font-medium p-2 text-red-500 hover:bg-red-300/30'
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
