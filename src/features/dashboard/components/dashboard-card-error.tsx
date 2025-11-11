'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

// TYPES
interface DashboardCardErrorProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function DashboardCardError({
  title = 'Failed to load data',
  description = 'There was an error loading this information. Please try again.',
  onRetry
}: DashboardCardErrorProps) {
  return (
    <Card
      className='border-destructive/50'
      role='alert'
      aria-live='assertive'
      aria-atomic='true'
    >
      <CardHeader>
        <div className='flex items-center gap-2'>
          <AlertCircle
            className='h-5 w-5 text-destructive'
            aria-hidden='true'
          />
          <CardTitle className='text-base'>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button
            onClick={onRetry}
            variant='outline'
            size='sm'
            aria-label='Retry loading data'
          >
            Retry
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
