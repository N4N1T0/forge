'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import ModalProjectConfig from '@/features/projects/components/modal-project-config'
import { useProjectParams } from '@/features/projects/hooks/use-project-id'
import { TaskFilters } from '@/features/tasks/components/task-filters'
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters'
import { useGetTasks } from '@/features/tasks/server/use-get-tasks'
import { Projects } from '@/types/appwrite'
import { MoreHorizontal } from 'lucide-react'
import { useQueryState } from 'nuqs'
import {
  DataCalendarView,
  DataGanttView,
  DataKanban,
  TaskTableView
} from './index'

export const TaskViewSwitcher = ({
  initialValues
}: {
  initialValues: Projects
}) => {
  // STATE
  const [view, setView] = useQueryState('view', {
    defaultValue: 'table'
  })
  const [{ assigneeId, dueDate, search, status }] = useTaskFilters()

  // HOOKS
  const { workspaceId, projectId } = useProjectParams()
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    assigneeId: assigneeId || undefined,
    dueDate: dueDate || undefined,
    search: search || undefined,
    status: status || undefined
  })

  // RENDER
  return (
    <Tabs className='flex-1 w-full' defaultValue={view} onValueChange={setView}>
      <div className='h-full flex flex-col overflow-auto p-2'>
        <div className='w-full flex justify-between items-center flex-wrap'>
          <TabsList className='bg-transparent h-12 pb-2'>
            <TabsTrigger
              value='table'
              className='w-full lg:w-auto px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground'
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value='kanban'
              className='w-full lg:w-auto px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground'
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger
              value='calendar'
              className='w-full lg:w-auto px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground'
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value='gantt'
              className='w-full lg:w-auto px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground'
            >
              Gantt
            </TabsTrigger>
          </TabsList>

          <div className='flex items-center justify-center'>
            {/* FILTERS */}
            <TaskFilters />
            <ModalProjectConfig project={initialValues}>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal />
              </Button>

              {/* PROJECT CONFIG */}
            </ModalProjectConfig>
          </div>
        </div>

        <TooltipProvider>
          <TabsContent value='table' className='mt-0'>
            <TaskTableView data={tasks} isLoading={isLoadingTasks} />
          </TabsContent>
          <TabsContent value='kanban' className='mt-0'>
            <DataKanban data={tasks} isLoading={isLoadingTasks} />
          </TabsContent>
          <TabsContent value='calendar' className='mt-0'>
            <DataCalendarView data={tasks} isLoading={isLoadingTasks} />
          </TabsContent>
          <TabsContent value='gantt' className='mt-0'>
            <DataGanttView data={tasks} isLoading={isLoadingTasks} />
          </TabsContent>
        </TooltipProvider>
      </div>
    </Tabs>
  )
}
