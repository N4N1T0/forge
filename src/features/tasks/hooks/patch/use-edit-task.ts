import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.task)[':taskId']['$patch'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.task)[':taskId']['$patch']
>

// HOOK
export const useEditTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.task[':taskId']['$patch']({
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
      toast.success('Task updated successfully', {
        description: 'The task has been updated.'
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })

      if (success) {
        queryClient.invalidateQueries({ queryKey: ['task', data.$id] })
      }
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error updating task'

      switch (true) {
        case errorMessage.includes('not a member'):
          toast.error('No permissions', {
            description:
              'You do not have permissions to update tasks in this workspace.'
          })
          break
        case errorMessage.includes('Project ID is required'):
          toast.error('Project required', {
            description: 'The project ID is required to update the task.'
          })
          break
        case errorMessage.includes('Task name is required'):
          toast.error('Task name required', {
            description: 'The task name is required.'
          })
          break
        case errorMessage.includes('Assignee ID is required'):
          toast.error('Assignee required', {
            description: 'The assignee ID is required to update the task.'
          })
          break
        default:
          toast.error('Error updating task', {
            description: errorMessage
          })
          break
      }
    }
  })

  return mutation
}
