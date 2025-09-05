import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

interface UseGetMembersProps {
  workspaceId: string
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
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
