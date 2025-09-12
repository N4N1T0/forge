import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { InferRequestType } from 'hono'

// TYPES
type RequestType = InferRequestType<(typeof client.api.task)['$get']>

// HOOK
export const useGetTasks = ({
  workspaceId,
  projectId,
  assigneeId,
  status,
  search,
  dueDate
}: RequestType['query']) => {
  const query = useQuery({
    queryKey: [
      'tasks',
      workspaceId,
      projectId,
      assigneeId,
      status,
      search,
      dueDate
    ],
    enabled: !!workspaceId,
    queryFn: async () => {
      const queryParams: Record<string, string | string[]> = {
        workspaceId
      }

      if (projectId) {
        queryParams.projectId = projectId
      }

      if (assigneeId) {
        queryParams.assigneeId = assigneeId
      }

      if (status) {
        queryParams.status = status
      }

      if (search) {
        queryParams.search = search
      }

      if (dueDate) {
        queryParams.dueDate = dueDate
      }

      const response = await client.api.task.$get({
        query: queryParams
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })

  return query
}
