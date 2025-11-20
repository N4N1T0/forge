'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DragEndEvent,
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider
} from '@/components/ui/kanban'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { status } from '@/data'
import {
  formatTaskDate,
  TaskAction,
  TaskEmptySearchView,
  TaskEmptyView,
  TaskKanbanSkeleton,
  TaskViewError,
  useChangeTaskStatus,
  useTaskFilters
} from '@/features/tasks'
import { cn, sanitizeHtml } from '@/lib/utils'
import { DataViewProps } from '@/types'
import { Status } from '@/types/appwrite'
import { MoreVertical } from 'lucide-react'
import { useCallback, useState } from 'react'

// TYPE
type DataKanbanProps = DataViewProps
type DataKanbanBoard = {
  id: string
  name: string
  color: string
}

// CONSTANTS
const boards: DataKanbanBoard[] = status.map(({ label, value, color }) => ({
  id: value,
  name: label,
  color
}))

export const DataKanban = ({
  data,
  isLoading,
  error = false,
  refetch
}: DataKanbanProps) => {
  // HOOKS
  const { mutate: changeTaskStatus } = useChangeTaskStatus()
  const { isAnyFilterActive } = useTaskFilters()

  // STATE
  const [tasks, setTasks] = useState(
    () =>
      data?.map((task) => ({
        id: task.$id,
        column: task.status,
        ...task
      })) || []
  )

  // HANDLERS
  const HandleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (!over) return

      const status = boards.find((board) => board.id === over.id)?.id

      if (!status) {
        return
      }

      changeTaskStatus({
        json: { status: status as Status },
        param: { taskId: active.id as string }
      })

      setTasks(
        tasks.map((task) => {
          if (task.id === active.id) {
            return { ...task, column: status as Status }
          }
          return task
        })
      )
    },
    [changeTaskStatus, tasks]
  )

  // RENDER
  if (isLoading) {
    return <TaskKanbanSkeleton />
  }

  if (error && !isLoading) {
    return <TaskViewError handleRetry={refetch} />
  }

  if ((!data || data.length === 0) && !isAnyFilterActive) {
    return <TaskEmptyView />
  }

  if ((!data || data.length === 0) && isAnyFilterActive) {
    return <TaskEmptySearchView />
  }

  return (
    <section className='pt-4 size-full'>
      <KanbanProvider columns={boards} data={tasks} onDragEnd={HandleDragEnd}>
        {({ color, id, name }: DataKanbanBoard) => (
          <KanbanBoard id={id} key={id}>
            <KanbanHeader className='border-b border-muted-foreground'>
              <div className='flex items-center gap-2'>
                <div
                  className='size-2 rounded-full'
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
              </div>
            </KanbanHeader>
            <KanbanCards id={id}>
              {(data: (typeof tasks)[number]) => {
                const { status, id, name, assignee, dueDate, description } =
                  data
                const formattedDescription = sanitizeHtml(description)
                const { formattedDate, textColor } = formatTaskDate(dueDate)

                return (
                  <KanbanCard
                    column={status}
                    id={id}
                    key={id}
                    name={name}
                    className='gap-2'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex flex-col gap-1'>
                        <p className='m-0 flex-1 font-medium text-sm'>{name}</p>
                      </div>
                      {assignee && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar className='size-6 shrink-0'>
                              <AvatarFallback className='uppercase text-xs'>
                                {assignee.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{assignee.name}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <p className='m-0 text-muted-foreground text-xs line-clamp-2'>
                      {formattedDescription}
                    </p>
                    <div className='flex w-full justify-between items-center'>
                      {dueDate && (
                        <p
                          className={cn(
                            'm-0 text-xs text-muted-foreground',
                            textColor
                          )}
                        >
                          {formattedDate}
                        </p>
                      )}
                      <TaskAction task={data} showStatus={true}>
                        <Button variant='ghost' size='sm'>
                          <MoreVertical className='size-4' />
                        </Button>
                      </TaskAction>
                    </div>
                  </KanbanCard>
                )
              }}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </section>
  )
}
