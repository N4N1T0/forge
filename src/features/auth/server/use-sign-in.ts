import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

type ResponseType = InferResponseType<
  (typeof client.api.login)['sign-in']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.login)['sign-in']['$post']
>

export const useSignIn = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.login['sign-in']['$post'](json)
      return response.json()
    }
  })

  return mutation
}
