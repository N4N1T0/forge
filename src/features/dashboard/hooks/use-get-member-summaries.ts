import type { MemberSummary } from '@/features/dashboard/types'
import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import type { InferResponseType } from 'hono/client'

// TYPES
interface UseGetMemberSummariesProps {
  workspaceId: string
}

type ResponseType = InferResponseType<
  (typeof client.api.dashboard)[':workspaceId']['members']['$get']
>

// HOOKS
export const useGetMemberSummaries = ({
  workspaceId
}: UseGetMemberSummariesProps) => {
  return useQuery<MemberSummary[]>({
    queryKey: ['dashboard', workspaceId, 'members'],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.dashboard[':workspaceId'][
        'members'
      ].$get({
        param: { workspaceId }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch member summaries')
      }

      const data: ResponseType = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })
}
