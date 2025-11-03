import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DeleteCommentData {
  taskId: string
  commentId: string
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, commentId }: DeleteCommentData) => {
      const response = await client.api.task[':taskId'].comments[':commentId'][
        '$delete'
      ]({
        param: { taskId, commentId }
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.data)
      }

      return result.data
    },
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] })
      toast.success('Comment deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete comment')
    }
  })
}
