'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { status as statusData } from '@/data'
import { TaskCommentsSection } from '@/features/tasks/components/comments'
import { ModalTaskWrapper } from '@/features/tasks/components/modal-task-wrapper'
import { useDeleteTask } from '@/features/tasks/server/use-delete-task'
import { formatTaskDate } from '@/features/tasks/utils'
import { useConfirm } from '@/hooks/use-confirm'
import { cn } from '@/lib/utils'
import { BaseFormProps, FormattedMembers } from '@/types'
import { Tasks } from '@/types/appwrite'
import { CalendarDays, Pencil, Share, Trash, X } from 'lucide-react'
import { toast } from 'sonner'

interface TaskInfoView extends BaseFormProps {
  task: Tasks
  setIsEdit: (isEdit: boolean) => void
}

export const TaskInfoView = ({ onCancel, task, setIsEdit }: TaskInfoView) => {
  return (
    <ModalTaskWrapper>
      {({ members, currentUserId, isLoading }) => (
        <TaskInfoViewContent
          members={members}
          currentUserId={currentUserId}
          isLoading={isLoading}
          onCancel={onCancel}
          task={task}
          setIsEdit={setIsEdit}
        />
      )}
    </ModalTaskWrapper>
  )
}

interface TaskInfoViewProps {
  task: Tasks
  onCancel: (() => void) | undefined
  members: FormattedMembers
  currentUserId: string | undefined
  isLoading: boolean
  setIsEdit: (isEdit: boolean) => void
}

export const TaskInfoViewContent = ({
  task,
  onCancel,
  isLoading,
  members,
  currentUserId,
  setIsEdit
}: TaskInfoViewProps) => {
  // MUTATIONS & CONFIRM
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const [confirmDelete, ConfirmDeleteDialog] = useConfirm(
    'Delete task',
    'This action cannot be undone. Do you want to delete this task?',
    'destructive'
  )

  // RENDER
  if (!task) return null

  // CONST
  const statusMeta = statusData.find((s) => s.value === task.status)
  const { formattedDate, textColor } = formatTaskDate(task.dueDate)
  const member = members?.find((m) => m?.$id === task.assigneeId)

  // HANDLERS
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/tasks/${task.$id}`
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success('Task link copied to clipboard', {
          position: 'bottom-right'
        })
      })
      .catch(() => {
        toast.error('Failed to copy link', {
          position: 'bottom-right'
        })
      })
  }

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

  return (
    <Card className='size-full flex flex-col pt-3.5 pb-0 gap-4 min-w-[500px]'>
      <ConfirmDeleteDialog />
      <CardHeader className='gap-2 flex justify-between'>
        <div>
          <Button
            variant='link'
            size='sm'
            disabled={isLoading}
            onClick={handleShare}
          >
            <Share /> Share
          </Button>
          <Button
            variant='link'
            size='sm'
            disabled={isLoading}
            onClick={() => setIsEdit(true)}
          >
            <Pencil /> Edit
          </Button>
          <Button
            variant='link'
            size='sm'
            disabled={isLoading || isDeleting}
            onClick={handleDelete}
          >
            <Trash /> Delete
          </Button>
        </div>

        <Button
          variant='ghost'
          size='icon'
          onClick={onCancel}
          disabled={isLoading}
        >
          <X />
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className='space-y-6 flex-1 overflow-y-auto min-h-0'>
        {/* NAME */}
        <section className='space-y-2'>
          <div className='flex flex-wrap items-center gap-2 mt-2'>
            {statusMeta && (
              <Badge variant='outline' className='gap-1'>
                <span
                  className='inline-block size-2 rounded-full'
                  style={{ backgroundColor: statusMeta.color }}
                  aria-hidden='true'
                />
                {statusMeta.label}
              </Badge>
            )}

            {task.dueDate && (
              <Badge variant='outline' className={cn('gap-1', textColor)}>
                <CalendarDays className='size-3' />
                <span className='truncate'>{formattedDate}</span>
              </Badge>
            )}
          </div>
          <h2 className='text-2xl font-bold'>{task.name}</h2>
        </section>

        <Separator />

        {/* DESCRIPTION */}
        <section className='space-y-2'>
          <h3 className='text-sm font-semibold'>Description</h3>
          {task.description ? (
            <div
              className='dark:prose-invert prose max-w-none'
              dangerouslySetInnerHTML={{ __html: task.description }}
            />
          ) : (
            <p className='text-sm text-muted-foreground'>
              No description provided.
            </p>
          )}
        </section>

        <Separator />

        {/* ASSIGNEE */}
        <section className='space-y-2'>
          <h3 className='text-sm font-semibold'>Assignee</h3>
          <div className='flex flex-wrap items-center gap-2'>
            {member ? (
              <Badge variant='outline' className='p-2'>
                {member.name}
              </Badge>
            ) : (
              <p className='text-sm text-muted-foreground'>No assignees.</p>
            )}
          </div>
        </section>

        {/* COMMENTS SECTION */}
        {currentUserId && (
          <TaskCommentsSection
            key={task.$id}
            taskId={task.$id}
            currentUserId={currentUserId}
          />
        )}
      </CardContent>
    </Card>
  )
}
