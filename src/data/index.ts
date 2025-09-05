import { ClipboardCheck, HouseIcon, Settings, UsersIcon } from 'lucide-react'

export const routes = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HouseIcon
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: ClipboardCheck
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Members',
    href: '/members',
    icon: UsersIcon
  }
]

export const THEME_ITEMS = [
  { value: 'light', label: 'Light', image: '/ui-light.png' },
  { value: 'dark', label: 'Dark', image: '/ui-dark.png' },
  { value: 'system', label: 'System', image: '/ui-system.png' }
]
