'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CommentItem, PopulatedComment } from '@/features/tasks'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

// TYPES
interface Props {
  comments: PopulatedComment[]
  currentUserId: string
  hasNextPage?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
}

export const CommentThread = ({
  comments,
  hasNextPage,
  onLoadMore,
  isLoadingMore
}: Props) => {
  // CONST
  const scrollRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // EFFECTS
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [comments.length])

  useEffect(() => {
    if (!hasNextPage || !onLoadMore || !loadMoreRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [hasNextPage, onLoadMore, isLoadingMore])

  return (
    <div className='space-y-4'>
      {/* LIST */}
      <div
        ref={scrollRef}
        className='max-h-80 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'
        role='log'
        aria-label='Comments thread'
        aria-live='polite'
      >
        {comments.map((comment, index) => (
          <CommentItem
            key={comment.$id}
            comment={comment}
            isFirst={index === 0}
            isLast={index === comments.length - 1}
          />
        ))}

        {/* LOAD MORE*/}
        {hasNextPage && (
          <div ref={loadMoreRef} className='py-2'>
            {isLoadingMore ? (
              <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading more comments...
              </div>
            ) : (
              <Button
                variant='ghost'
                size='sm'
                onClick={onLoadMore}
                className='w-full'
                aria-label='Load more comments'
              >
                Load more comments
              </Button>
            )}
          </div>
        )}

        {/* LOADING STATE */}
        {isLoadingMore && (
          <div className='space-y-4'>
            {Array.from({ length: 2 }).map((_, i) => (
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
        )}
      </div>
    </div>
  )
}
