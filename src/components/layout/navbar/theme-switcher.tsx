'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

interface ThemeSwitcherProps {
  workspaceTheme: string | undefined
}

export function ThemeSwitcher({ workspaceTheme }: ThemeSwitcherProps) {
  const { setTheme } = useTheme()
  const isApplied = useRef(false)

  useEffect(() => {
    if (!isApplied.current && workspaceTheme) {
      setTheme(workspaceTheme)
      isApplied.current = true
    }
  }, [workspaceTheme, setTheme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] transition-all dark:hidden' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] hidden dark:block' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
