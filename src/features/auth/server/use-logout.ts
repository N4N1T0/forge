import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

type ResponseType = InferResponseType<
  (typeof client.api.login)['logout']['$post']
>

export const useLogout = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.login['logout']['$post']()
      return response.json()
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['current']
      })
    }
  })

  return mutation
}
