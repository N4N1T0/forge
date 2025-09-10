'use client'

import { SpacemanThemeProvider } from '@space-man/react-theme-animation'
import * as React from 'react'

export function SpacemanThemeProviderClient({
  children,
  ...props
}: React.ComponentProps<typeof SpacemanThemeProvider>) {
  return <SpacemanThemeProvider {...props}>{children}</SpacemanThemeProvider>
}
