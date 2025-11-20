'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section
      id='error-page'
      className='h-screen flex flex-col items-center justify-center'
    >
      <AlertTriangle
        className='text-primary w-auto h-1/3 aspect-square'
        strokeWidth={0.3}
      />
      <p className='text-destructive  text-xl'>{error.name}</p>
      <p className='text-muted-foreground text-sm'>{error.message}</p>
      <div className='flex gap-2 mt-4'>
        <Link href='/' className={buttonVariants({ variant: 'outline' })}>
          Go back
        </Link>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </section>
  )
}
