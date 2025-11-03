'use client'

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger
} from '@/components/ui/context-menu'
import { status } from '@/data'
import { ModalTaskEditForm } from '@/features/tasks/components/edit'
import { ModalTaskInfo } from '@/features/tasks/components/info'
import { useTaskEditModal, useTaskViewModal } from '@/features/tasks/hooks'
import { useChangeTaskStatus } from '@/features/tasks/server/patch/use-change-task-status'
import { useDeleteTask } from '@/features/tasks/server/use-delete-task'
import { useConfirm } from '@/hooks/use-confirm'
import { Status, Tasks } from '@/types/appwrite'

type Props = {
  task: Tasks
}

export const TaskContextMenu = ({ task }: Props) => {
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
    <>
      {/* MODALS */}
      <ModalTaskEditForm task={task} />
      <ModalTaskInfo task={task} />
      <DeleteWorkspaceModal />

      <ContextMenuContent className='w-64'>
        <ContextMenuLabel>Task actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => handleOpenViewModal(task.$id)}
          disabled={isLoading}
        >
          View
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleOpenEditModal(task.$id)}
          disabled={isLoading}
        >
          Edit
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>Status</ContextMenuSubTrigger>
          <ContextMenuSubContent className='w-48'>
            <ContextMenuRadioGroup value={task.status}>
              {status.map(({ label, value, color }) => (
                <ContextMenuRadioItem
                  key={value}
                  value={value}
                  onClick={() => handleStatusChange(value as Status)}
                  disabled={isLoading}
                >
                  <span
                    className='size-4 rounded-full mr-2 inline-block'
                    style={{ backgroundColor: color }}
                  ></span>
                  {label}
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />
        <ContextMenuItem
          variant='destructive'
          onClick={handleDelete}
          disabled={isLoading}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </>
  )
}
