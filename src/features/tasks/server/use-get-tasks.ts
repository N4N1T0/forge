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
    retry: (failureCount, _error) => {
      if (search && failureCount >= 1) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: search ? 0 : 5 * 60 * 1000,
    queryFn: async () => {
      try {
        const queryParams: Record<string, string | string[]> = {}

        queryParams.workspaceId = workspaceId

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
          if (search.length > 100) {
            throw new Error('Search query too long (max 100 characters)')
          }
          queryParams.search = search
        }

        if (dueDate) {
          queryParams.dueDate = dueDate
        }

        const response = await client.api.task.$get({
          query: queryParams as {
            workspaceId: string | string[]
            projectId?: string | string[]
            assigneeId?: string | string[]
            status?: string | string[]
            search?: string | string[]
            dueDate?: string | string[]
          }
        })

        if (!response.ok) {
          if (response.status === 400) {
            throw new Error('Invalid search parameters')
          } else if (response.status === 403) {
            throw new Error('Access denied to workspace tasks')
          } else if (response.status === 404) {
            throw new Error('Workspace not found')
          } else if (response.status >= 500) {
            throw new Error('Server error - please try again later')
          } else {
            throw new Error(`Request failed with status ${response.status}`)
          }
        }

        const data = await response.json()

        if (!data.success) {
          const errorMessage =
            typeof data.data === 'string' ? data.data : 'Failed to fetch tasks'
          throw new Error(errorMessage)
        }

        return data.data
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error(
            'Network connection failed - please check your internet connection'
          )
        }

        throw error
      }
    }
  })

  return query
}
