import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.profile.password)['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.profile.password)['$post']
>

// HOOK
export const useChangePassword = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.profile.password.$post({ json })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('Password changed successfully', {
        description: 'Your password has been updated.'
      })
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error changing password'

      // Handle specific error cases
      if (errorMessage.includes('Invalid credentials')) {
        toast.error('Incorrect current password', {
          description: 'The current password you entered is incorrect.'
        })
      } else {
        toast.error('Error changing password', {
          description: errorMessage
        })
      }
    }
  })

  return mutation
}
