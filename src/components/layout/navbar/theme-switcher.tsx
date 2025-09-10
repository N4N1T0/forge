'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useSpacemanTheme } from '@space-man/react-theme-animation'
import { Moon, Sun } from 'lucide-react'

export function ThemeSwitcher() {
  const { switchThemeFromElement } = useSpacemanTheme()

  const handleCustomThemeSwitch = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    theme: 'light' | 'dark' | 'system'
  ) => {
    switchThemeFromElement(theme, event.currentTarget)
  }

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
        <DropdownMenuItem asChild>
          <Button
            onClick={(e) => handleCustomThemeSwitch(e, 'light')}
            variant='link'
            className='w-full'
          >
            Light
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={(e) => handleCustomThemeSwitch(e, 'dark')}
            variant='link'
            className='w-full'
          >
            Dark
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={(e) => handleCustomThemeSwitch(e, 'system')}
            variant='link'
            className='w-full'
          >
            System
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
