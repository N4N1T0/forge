'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateComment } from '@/features/tasks/server/comments/use-create-comment'
import { cn } from '@/lib/utils'
import { Loader2, Send } from 'lucide-react'
import { useRef, useState } from 'react'

interface CommentInputProps {
  taskId: string
  onCommentCreated?: () => void
}

export const CommentInput = ({ taskId }: CommentInputProps) => {
  // STATE
  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  // REFS
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // HOOKS
  const { mutate: createComment, isPending } = useCreateComment()

  // CONST
  const characterLimit = 2000
  const remainingChars = characterLimit - content.length
  const isOverLimit = remainingChars < 0

  // HANDLERS
  const handleSubmit = () => {
    if (!content.trim() || isOverLimit || isPending) return

    createComment(
      {
        taskId,
        content: content.trim()
      },
      {
        onSuccess: () => {
          setContent('')
          setIsFocused(false)
        }
      }
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isPending

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder='Add a comment... (Ctrl+Enter to submit)'
          className={cn(
            'min-h-[80px] resize-none pr-12',
            isOverLimit
              ? 'border-destructive focus-visible:ring-destructive'
              : ''
          )}
          disabled={isPending}
          aria-label='Comment input'
          aria-describedby='comment-help'
        />

        <Button
          size='sm'
          onClick={handleSubmit}
          disabled={!canSubmit}
          className='absolute bottom-2 right-2 size-8 p-0'
          aria-label='Submit comment'
        >
          {isPending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Send className='size-4' />
          )}
        </Button>
      </div>

      {/* CHAR COUNTER */}
      <div className='flex items-center justify-between text-xs'>
        <div id='comment-help' className='text-muted-foreground'>
          {isFocused && 'Press Ctrl+Enter to submit'}
        </div>
        <div
          className={cn(
            isOverLimit
              ? 'text-destructive'
              : remainingChars < 100
                ? 'text-orange-500'
                : 'text-muted-foreground'
          )}
        >
          {remainingChars} characters remaining
        </div>
      </div>

      {/* ERROR */}
      {isOverLimit && (
        <div className='text-xs text-destructive'>
          Comment exceeds the maximum length of {characterLimit} characters.
        </div>
      )}
    </div>
  )
}
