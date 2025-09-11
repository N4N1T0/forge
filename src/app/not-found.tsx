'use client'

import { buttonVariants } from '@/components/ui/button'
import { Ban } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <section
      id='error-page'
      className='h-screen flex flex-col items-center justify-center'
    >
      <Ban className='text-primary w-1/2 h-1/2' strokeWidth={0.1} />
      <p className='text-primary text-xl'>Oops! Page not found.</p>
      <p className='text-muted-foreground text-sm'>
        Please check the URL and try again.
      </p>
      <Link
        href='/'
        className={buttonVariants({ variant: 'outline', className: 'mt-2' })}
      >
        Go back
      </Link>
    </section>
  )
}
