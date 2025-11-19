import type { ProjectSummary } from '@/features/dashboard/types'
import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import type { InferResponseType } from 'hono/client'

// TYPES
interface UseGetProjectSummariesProps {
  workspaceId: string
}

type ResponseType = InferResponseType<
  (typeof client.api.dashboard)[':workspaceId']['projects']['$get']
>

// HOOKS
export const useGetProjectSummaries = ({
  workspaceId
}: UseGetProjectSummariesProps) => {
  return useQuery<ProjectSummary[]>({
    queryKey: ['dashboard', workspaceId, 'projects'],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.dashboard[':workspaceId'][
        'projects'
      ].$get({
        param: { workspaceId }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch project summaries')
      }

      const data: ResponseType = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })
}
