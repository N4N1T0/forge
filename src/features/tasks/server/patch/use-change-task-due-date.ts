import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.task)[':taskId']['due-date']['$patch'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.task)[':taskId']['due-date']['$patch']
>

// HOOK
export const useChangeTaskDueDate = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.task[':taskId']['due-date']['$patch']({
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
      const errorMessage = error.message || 'Error updating task due date'

      switch (true) {
        case errorMessage.includes('not a member'):
          toast.error('No permissions', {
            description:
              'You do not have permissions to update task due date in this workspace.'
          })
          break
        default:
          toast.error('Error updating due date', {
            description: errorMessage
          })
          break
      }

      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  return mutation
}