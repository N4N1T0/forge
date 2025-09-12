import { Status } from '@/types/appwrite'
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

export const status = [
  {
    value: Status.BACKLOG,
    label: 'Backlog',
    color: 'oklch(0.7 0.1 240)' // Blue-gray
  },
  {
    value: Status.TODO,
    label: 'To Do',
    color: 'oklch(0.75 0.15 30)' // Orange
  },
  {
    value: Status.IN_PROGRESS,
    label: 'In Progress',
    color: 'oklch(0.7 0.2 220)' // Blue
  },
  {
    value: Status.IN_REVIEW,
    label: 'In Review',
    color: 'oklch(0.7 0.18 280)' // Purple
  },
  {
    value: Status.DONE,
    label: 'Done',
    color: 'oklch(0.7 0.2 140)' // Green
  }
]
