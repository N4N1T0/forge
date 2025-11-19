import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.login)['logout']['$post']
>

// HOOK
export const useLogout = () => {
  const router = useRouter()
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
      queryClient.invalidateQueries({
        queryKey: ['workspaces']
      })
      setTimeout(() => {
        router.refresh()
      }, 500)
    }
  })

  return mutation
}
