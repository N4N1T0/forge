import { useProjectParams } from '@/features/projects/client/use-project-id'
import { useGetTasks } from '@/features/tasks/server/use-get-tasks'
import { TaskTableSkeleton } from './task-table-skeleton'

export const TaskTableView = () => {
  // STATE & CONTEXT
  const { workspaceId, projectId } = useProjectParams()
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId
  })

  // RENDER
  if (isLoadingTasks) {
    return <TaskTableSkeleton />
  }

  return <div>{JSON.stringify(tasks)}</div>
}
