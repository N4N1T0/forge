import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

export const useGetProfile = () => {
  const query = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await client.api.profile.$get()
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })

  return query
}
