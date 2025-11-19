import type { TaskStats } from '@/features/dashboard/types'
import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import type { InferResponseType } from 'hono/client'

// TYPES
interface UseGetTaskStatsProps {
  workspaceId: string
}

type ResponseType = InferResponseType<
  (typeof client.api.dashboard)[':workspaceId']['task-stats']['$get']
>

// HOOKS
export const useGetTaskStats = ({ workspaceId }: UseGetTaskStatsProps) => {
  return useQuery<TaskStats>({
    queryKey: ['dashboard', workspaceId, 'tasks'],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.dashboard[':workspaceId'][
        'task-stats'
      ].$get({
        param: { workspaceId }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch task statistics')
      }

      const data: ResponseType = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })
}
