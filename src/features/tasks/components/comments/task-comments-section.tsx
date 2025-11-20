'use client'

import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CommentInput,
  CommentThread,
  useTaskComments,
  type PopulatedComment
} from '@/features/tasks'
import { useCallback, useMemo } from 'react'

// TYPES
interface Props {
  taskId: string
  currentUserId: string
}

export const TaskCommentsSection = ({ taskId, currentUserId }: Props) => {
  // HOOKS
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTaskComments(taskId)

  // FLAT PAGES
  const comments: PopulatedComment[] = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.comments)
  }, [data?.pages])

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <section className='space-y-4'>
      <Separator />

      <div className='space-y-4'>
        <h3 className='text-sm font-semibold'>Comments</h3>

        {/* LOADING STATE */}
        {isPending ? (
          <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='size-8 rounded-full' />
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-16' />
                </div>
                <Skeleton className='h-12 w-full' />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* COMMENTS THREAD */}
            {comments && comments.length > 0 ? (
              <CommentThread
                comments={comments}
                currentUserId={currentUserId}
                hasNextPage={hasNextPage}
                onLoadMore={handleLoadMore}
                isLoadingMore={isFetchingNextPage}
              />
            ) : (
              <p className='text-sm text-muted-foreground py-4'>
                No comments yet. Be the first to comment!
              </p>
            )}
          </>
        )}

        {/* COMMENT INPUT */}
        <CommentInput taskId={taskId} />
      </div>
    </section>
  )
}
