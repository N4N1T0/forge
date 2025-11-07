'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function TasksErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Determine if this is a search-related error
  const isSearchError =
    error.message.includes('search') ||
    error.message.includes('Search') ||
    error.message.includes('query')

  return (
    <div className='flex flex-col size-full max-w-screen-2xl mx-auto p-4'>
      {/* HEADER */}
      <div className='flex flex-col gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Tasks</h1>
          <p className='text-muted-foreground'>
            Manage and track all workspace tasks
          </p>
        </div>
      </div>

      {/* ERROR CONTENT */}
      <div className='flex-1 flex flex-col items-center justify-center'>
        <div className='max-w-md text-center space-y-6'>
          <AlertTriangle
            className='mx-auto text-destructive w-16 h-16'
            strokeWidth={1}
          />

          <div className='space-y-2'>
            <h2 className='text-xl font-semibold text-destructive'>
              {isSearchError ? 'Search Error' : 'Something went wrong'}
            </h2>
            <p className='text-muted-foreground text-sm'>{error.message}</p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button onClick={reset} className='flex items-center gap-2'>
              <RefreshCw className='h-4 w-4' />
              Try again
            </Button>
            <Link
              href='/dashboard'
              className={buttonVariants({ variant: 'outline' })}
            >
              Go to Dashboard
            </Link>
          </div>

          {isSearchError && (
            <div className='mt-4 p-3 bg-muted/50 rounded-lg text-left'>
              <p className='text-sm text-muted-foreground'>
                <strong>Search Tips:</strong>
              </p>
              <ul className='text-xs text-muted-foreground mt-1 space-y-1'>
                <li>• Keep search terms under 100 characters</li>
                <li>• Try simpler or shorter search terms</li>
                <li>• Check your internet connection</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
