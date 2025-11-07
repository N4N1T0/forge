'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { status as statusData } from '@/data'
import { TaskAction } from '@/features/tasks/components/views/task-action'
import { useTaskViewModal } from '@/features/tasks/hooks'
import { formatTaskDate } from '@/features/tasks/utils'
import { cn } from '@/lib/utils'
import { FormattedMembers } from '@/types'
import { Tasks } from '@/types/appwrite'
import { CalendarDays, MoreHorizontal } from 'lucide-react'

interface TaskCardProps {
  task: Tasks
  members: FormattedMembers
}

export const TaskCard = ({ task, members }: TaskCardProps) => {
  // HOOKS
  const { handleOpen: handleOpenViewModal } = useTaskViewModal()
  const { formattedDate, textColor } = formatTaskDate(task.dueDate)

  // CONST
  const statusMeta = statusData.find((s) => s.value === task.status)
  const assignee = members?.find((m) => m?.$id === task.assigneeId)

  // HANDLER
  const handleCardClick = () => {
    handleOpenViewModal(task.$id)
  }

  return (
    <Card className='cursor-pointer hover:shadow-md transition-shadow'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1 min-w-0' onClick={handleCardClick}>
            <CardTitle className='text-base font-medium truncate mb-2'>
              {task.name}
            </CardTitle>

            {/* STATUS */}
            <div className='flex flex-wrap items-center gap-2'>
              {statusMeta && (
                <Badge variant='outline' className='gap-1 text-xs'>
                  <span
                    className='inline-block size-2 rounded-full'
                    style={{ backgroundColor: statusMeta.color }}
                    aria-hidden='true'
                  />
                  {statusMeta.label}
                </Badge>
              )}

              {task.dueDate && (
                <Badge
                  variant='outline'
                  className={cn('gap-1 text-xs', textColor)}
                >
                  <CalendarDays className='size-3' />
                  <span className='truncate'>{formattedDate}</span>
                </Badge>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <CardAction>
            <TaskAction task={task}>
              <Button variant='ghost' size='icon' className='size-8'>
                <MoreHorizontal className='size-4' />
              </Button>
            </TaskAction>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent onClick={handleCardClick}>
        {/* DESCRIPTION */}
        {task.description && (
          <div className='mb-3'>
            <p className='text-sm text-muted-foreground overflow-hidden text-ellipsis'>
              {task.description.replace(/<[^>]*>/g, '').substring(0, 100)}
              {task.description.replace(/<[^>]*>/g, '').length > 100 && '...'}
            </p>
          </div>
        )}

        {/* ASSIGNEE */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {assignee ? (
              <Badge variant='secondary' className='text-xs'>
                {assignee.name}
              </Badge>
            ) : (
              <span className='text-xs text-muted-foreground'>Unassigned</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
