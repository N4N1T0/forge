'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { type ErrorInfo, useEffect, useState } from 'react'
import type { DashboardErrorBoundaryProps } from '../types'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export function DashboardErrorBoundary({
  children,
  fallback,
  onError
}: DashboardErrorBoundaryProps) {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null
  })

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      const errorObj = new Error(error.message)
      errorObj.stack = error.error?.stack
      // Log error to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Dashboard Error Boundary caught an error:', errorObj)
      }

      setErrorState({
        hasError: true,
        error: errorObj,
        errorInfo: null
      })

      // Call optional error handler
      onError?.(errorObj, null)
      // TODO: Send error to error reporting service (e.g., Sentry)
      // reportErrorToService(errorObj, null)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(
        event.reason?.message || 'Unhandled promise rejection'
      )

      // Log error to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error(
          'Dashboard Error Boundary caught an unhandled rejection:',
          error
        )
      }

      setErrorState({
        hasError: true,
        error,
        errorInfo: null
      })

      // Call optional error handler
      onError?.(error, null)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [onError])

  const handleReset = (): void => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }
  if (errorState.hasError) {
    // Use custom fallback if provided
    if (fallback) {
      return fallback
    }

    // Default error UI with recovery options
    return (
      <Card className='border-destructive/50'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-destructive' />
            <CardTitle className='text-destructive'>
              Something went wrong
            </CardTitle>
          </div>
          <CardDescription>
            The dashboard encountered an error and couldn&apos;t be displayed.
            Please try refreshing or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* ERROR DETAILS (Development Only) */}
          {process.env.NODE_ENV === 'development' && errorState.error && (
            <div className='space-y-2'>
              <div className='rounded-md bg-muted p-3'>
                <p className='text-xs font-semibold text-muted-foreground mb-1'>
                  Error Message:
                </p>
                <p className='text-sm font-mono text-destructive'>
                  {errorState.error.message}
                </p>
              </div>
              {errorState.errorInfo?.componentStack && (
                <div className='rounded-md bg-muted p-3 max-h-40 overflow-auto'>
                  <p className='text-xs font-semibold text-muted-foreground mb-1'>
                    Component Stack:
                  </p>
                  <pre className='text-xs font-mono text-muted-foreground whitespace-pre-wrap'>
                    {errorState.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* RECOVERY ACTIONS */}
          <div className='flex gap-2'>
            <Button
              onClick={handleReset}
              variant='outline'
              size='sm'
              className='gap-2'
            >
              <RefreshCw className='h-4 w-4' />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant='default'
              size='sm'
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return children
}
