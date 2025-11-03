import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface CreateCommentData {
  taskId: string
  content: string
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, content }: CreateCommentData) => {
      const response = await client.api.task[':taskId'].comments.$post({
        param: { taskId },
        json: { content }
      })

      if (!response.ok) {
        throw new Error('Failed to create comment')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.data)
      }

      return result.data
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] })
      toast.success('Comment added successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add comment')
    }
  })
}
