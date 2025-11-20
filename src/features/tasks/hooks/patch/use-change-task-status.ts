import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.task)[':taskId']['status']['$patch'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.task)[':taskId']['status']['$patch']
>

// HOOK
export const useChangeTaskStatus = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.task[':taskId']['status']['$patch']({
        json,
        param
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: ({ data, success }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })

      if (success) {
        queryClient.invalidateQueries({ queryKey: ['task', data.$id] })
      }
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error updating task status'

      switch (true) {
        case errorMessage.includes('not a member'):
          toast.error('No permissions', {
            description:
              'You do not have permissions to update task status in this workspace.'
          })
          break
        case errorMessage.includes('Invalid status'):
          toast.error('Invalid status', {
            description: 'The provided status is not valid.'
          })
          break
        default:
          toast.error('Error updating status', {
            description: errorMessage
          })
          break
      }

      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  return mutation
}
