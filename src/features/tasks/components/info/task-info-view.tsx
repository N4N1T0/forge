'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { status as statusData } from '@/data'
import { ModalTaskWrapper } from '@/features/tasks/components/modal-task-wrapper'
import { formatTaskDate } from '@/features/tasks/utils'
import { cn } from '@/lib/utils'
import { BaseFormProps, FormattedMembers } from '@/types'
import { Tasks } from '@/types/appwrite'
import { CalendarDays, Pencil, Share, X } from 'lucide-react'
import { toast } from 'sonner'

interface TaskInfoView extends BaseFormProps {
  task: Tasks
  setIsEdit: (isEdit: boolean) => void
}

export const TaskInfoView = ({ onCancel, task, setIsEdit }: TaskInfoView) => {
  return (
    <ModalTaskWrapper>
      {({ members, isLoading }) => (
        <TaskInfoViewContent
          members={members}
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
  isLoading: boolean
  setIsEdit: (isEdit: boolean) => void
}

export const TaskInfoViewContent = ({
  task,
  onCancel,
  isLoading,
  members,
  setIsEdit
}: TaskInfoViewProps) => {
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

  return (
    <Card className='size-full overflow-y-auto pt-3.5 pb-0 gap-4 min-w-[500px]'>
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

      <CardContent className='space-y-6'>
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
        <CardFooter className='space-y-2 mt-auto px-0 flex-col items-start'>
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
        </CardFooter>
      </CardContent>
    </Card>
  )
}
