import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

type ResponseType = InferResponseType<
  (typeof client.api.login)['sign-up']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.login)['sign-up']['$post']
>

export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.login['sign-up']['$post'](json)
      return response.json()
    }
  })

  return mutation
}
