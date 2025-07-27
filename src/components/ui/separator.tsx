'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const separatorVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: 'w-full h-[1px]',
      vertical: 'h-full w-[1px]'
    },
    variant: {
      default: 'bg-border',
      dashed: 'border-0 border-t border-dashed border-border',
      accent: 'bg-accent dark:bg-orange-500'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

function Separator({
  className,
  variant,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  variant?: 'default' | 'dashed'
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Separator }
