'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentMember } from '@/features/members'
import { useDeleteComment, type PopulatedComment } from '@/features/tasks'
import { useConfirm } from '@/hooks/use-confirm'
import { cn, getInitials } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Trash2 } from 'lucide-react'

// TYPES
interface Props {
  comment: PopulatedComment
  isFirst?: boolean
  isLast?: boolean
}

export const CommentItem = ({ comment, isFirst, isLast }: Props) => {
  // HOOKS
  const { data: currentMember } = useCurrentMember()
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment()
  const [confirmDelete, DeleteCommentModal] = useConfirm(
    'Delete comment',
    'This comment will be deleted',
    'destructive'
  )

  // CONST
  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return 'Unknown time'
    }
  }

  // HANDLERS
  const handleDelete = async () => {
    const ok = await confirmDelete()
    if (!ok) return

    deleteComment({ param: { taskId: comment.taskId, commentId: comment.$id } })
  }

  // RENDER
  const renderContent = (content: string) => {
    const highlightedContent = content.replace(
      /<span[^>]*class="mention"[^>]*data-mention-id="([^"]+)"[^>]*data-mention-name="([^"]+)"[^>]*>(@[^<]*)<\/span>/g,
      '<span class="mention bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-md font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer" data-mention-id="$1" data-mention-name="$2" title="$2">$3</span>'
    )

    return (
      <div
        className='prose prose-sm dark:prose-invert max-w-none [&_.mention]:not-prose'
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
        role='article'
        aria-label={`Comment by ${comment.author.name}`}
      />
    )
  }

  return (
    <div
      className={cn('flex gap-3 group', isFirst && 'pt-0', isLast && 'pb-0')}
      role='article'
      aria-labelledby={`comment-author-${comment.$id}`}
    >
      <Avatar className='size-8 flex-shrink-0'>
        <AvatarFallback className='text-xs'>
          {getInitials(comment.author.name)}
        </AvatarFallback>
      </Avatar>

      {/* HEADER */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-1'>
          <span
            id={`comment-author-${comment.$id}`}
            className='text-sm font-medium text-foreground'
          >
            {comment.author.name}
          </span>
          <time
            className='text-xs text-muted-foreground'
            dateTime={comment.$createdAt}
            title={new Date(comment.$createdAt).toLocaleString()}
          >
            {formatTimestamp(comment.$createdAt)}
          </time>
          {currentMember?.$id === comment.author.$id && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleDelete}
              disabled={isDeleting}
              className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity'
              aria-label='Delete comment'
            >
              {isDeleting ? (
                <span className='text-xs'>...</span>
              ) : (
                <Trash2 className='size-4 text-destructive' />
              )}
            </Button>
          )}
        </div>

        {/* CONTENT */}
        <div className='text-sm'>{renderContent(comment.content)}</div>
      </div>
      {/* Confirm Modal */}
      <DeleteCommentModal />
    </div>
  )
}
