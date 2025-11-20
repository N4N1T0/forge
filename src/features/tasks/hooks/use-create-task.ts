import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<(typeof client.api.task)['$post']>
type RequestType = InferRequestType<(typeof client.api.task)['$post']>

// HOOK
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.task['$post']({ json })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('Task created successfully', {
        description: 'Your new task has been created.'
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error creating task'

      switch (true) {
        case errorMessage.includes('not a member'):
          toast.error('No permissions', {
            description:
              'You do not have permissions to create tasks in this workspace.'
          })
          break
        case errorMessage.includes('Project ID is required'):
          toast.error('Project required', {
            description: 'You must select a project to create the task.'
          })
          break
        case errorMessage.includes('Task name is required'):
          toast.error('Name required', {
            description: 'The task name is required.'
          })
          break
        case errorMessage.includes('Assignee ID is required'):
          toast.error('Assignee required', {
            description: 'You must assign the task to a team member.'
          })
          break
        default:
          toast.error('Error creating task', {
            description: errorMessage
          })
          break
      }
    }
  })

  return mutation
}
