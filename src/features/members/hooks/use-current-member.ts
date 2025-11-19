import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

// TYPES
type ResponseType = Extract<
  InferResponseType<typeof client.api.member.member.$get>,
  { success: true }
>['data']

export const useCurrentMember = () => {
  const query = useQuery<ResponseType>({
    queryKey: ['member'],
    queryFn: async () => {
      const response = await client.api.member.member.$get()

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })

  return query
}
