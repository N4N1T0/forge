import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.profile.account)['$delete']
>
type RequestType = InferRequestType<
  (typeof client.api.profile.account)['$delete']
>

// HOOK
export const useDeleteAccount = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.profile.account.$delete({ json })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: async () => {
      toast.success('Account deleted successfully', {
        description: 'Your account has been permanently deleted.'
      })

      // Logout by calling the logout endpoint
      await client.api.login['logout']['$post']()

      // Clear all queries
      queryClient.clear()

      // Redirect to sign-in page
      setTimeout(() => {
        router.push('/sign-in')
        router.refresh()
      }, 500)
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error deleting account'

      // Handle specific error cases
      if (errorMessage.includes('Email does not match')) {
        toast.error('Email does not match', {
          description: 'Please verify that the email is correct.'
        })
      } else {
        toast.error('Error deleting account', {
          description: errorMessage
        })
      }
    }
  })

  return mutation
}
