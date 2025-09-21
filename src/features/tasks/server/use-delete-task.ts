import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.task)[':taskId']['$delete']
>
type RequestType = InferRequestType<
  (typeof client.api.task)[':taskId']['$delete']
>

// HOOK
export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.task[':taskId']['$delete']({
        param
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: ({ data, success }) => {
      toast.success('Task deleted successfully', {
        description: 'The task has been deleted.'
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })

      if (success) {
        queryClient.invalidateQueries({ queryKey: ['task', data.$id] })
      }
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error deleting task'

      switch (true) {
        case errorMessage.includes('not a member'):
          toast.error('No permissions', {
            description:
              'You do not have permissions to delete tasks in this workspace.'
          })
          break
        case errorMessage.includes('Project ID is required'):
          toast.error('Project required', {
            description: 'The project ID is required to delete the task.'
          })
          break
        case errorMessage.includes('Task name is required'):
          toast.error('Task required', {
            description: 'The task ID is required.'
          })
          break
        case errorMessage.includes('Assignee ID is required'):
          toast.error('Assignee required', {
            description: 'The assignee ID is required to delete the task.'
          })
          break
        default:
          toast.error('Error deleting task', {
            description: errorMessage
          })
          break
      }
    }
  })

  return mutation
}
