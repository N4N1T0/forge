import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

export const useCurrentMember = () => {
  const query = useQuery({
    queryKey: ['member'],
    queryFn: async () => {
      const response = await client.api.member.member.$get()
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })

  return query
}
