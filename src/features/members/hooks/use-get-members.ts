import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

// TYPES
interface UseGetMembersProps {
  workspaceId: string
}
type ResponseType = Extract<
  InferResponseType<typeof client.api.member.$get>,
  { success: true }
>['data']

// HOOKS
export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery<ResponseType>({
    queryKey: ['members', workspaceId],
    queryFn: async () => {
      const response = await client.api.member.$get({
        query: {
          workspaceId
        }
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
