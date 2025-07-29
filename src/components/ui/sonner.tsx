'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      position='top-right'
      expand={true}
      richColors
      closeButton
      style={
        {
          '--normal-bg': 'var(--card)',
          '--normal-text': 'var(--card-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'oklch(0.95 0.05 140)',
          '--success-text': 'oklch(0.3 0.15 140)',
          '--success-border': 'oklch(0.7 0.15 140)',
          '--error-bg': 'oklch(0.95 0.05 27.5)',
          '--error-text': 'var(--destructive)',
          '--error-border': 'var(--destructive)',
          '--warning-bg': 'oklch(0.95 0.05 50)',
          '--warning-text': 'oklch(0.4 0.2 50)',
          '--warning-border': 'oklch(0.7 0.2 50)',
          '--info-bg': 'oklch(0.95 0.05 220)',
          '--info-text': 'oklch(0.4 0.15 220)',
          '--info-border': 'oklch(0.7 0.15 220)'
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: 'var(--card)',
          border: '1px solid var(--border)',
          color: 'var(--card-foreground)',
          borderRadius: 'var(--radius)',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        },
        className:
          'group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg'
      }}
      {...props}
    />
  )
}

export { Toaster }
