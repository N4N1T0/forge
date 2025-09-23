'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useProjectParams } from '@/features/projects/client/use-project-id'
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters'
import { useGetTasks } from '@/features/tasks/server/use-get-tasks'
import { useQueryState } from 'nuqs'
import { TaskTableView } from '.'
import { DataKanban } from './kanban/data-kanban-view'

export const TaskViewSwitcher = () => {
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
    <Tabs
      className='flex-1 w-full border'
      defaultValue={view}
      onValueChange={setView}
    >
      <div className='h-full flex flex-col overflow-auto p-2'>
        <TabsList className='w-full lg:w-auto bg-transparent border-b h-12 pb-2'>
          <TabsTrigger value='table' className='w-full lg:w-auto'>
            Table
          </TabsTrigger>
          <TabsTrigger value='kanban' className='w-full lg:w-auto'>
            Kanban
          </TabsTrigger>
          <TabsTrigger value='calendar' className='w-full lg:w-auto'>
            Calendar
          </TabsTrigger>
          <TabsTrigger value='gantt' className='w-full lg:w-auto'>
            Gantt
          </TabsTrigger>
        </TabsList>

        <TooltipProvider>
          <TabsContent value='table' className='mt-0'>
            <TaskTableView data={tasks} isLoading={isLoadingTasks} />
          </TabsContent>
          <TabsContent value='kanban' className='mt-0'>
            <DataKanban data={tasks} isLoading={isLoadingTasks} />
          </TabsContent>
          <TabsContent value='calendar' className='mt-0'>
            Calendar
          </TabsContent>
          <TabsContent value='gantt' className='mt-0'>
            Gantt
          </TabsContent>
        </TooltipProvider>
      </div>
    </Tabs>
  )
}
