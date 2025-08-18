import { ClipboardCheck, HouseIcon, Settings, UsersIcon } from 'lucide-react'

export const routes = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HouseIcon
  },
  {
    name: 'Tareas',
    href: '/tasks',
    icon: ClipboardCheck
  },
  {
    name: 'Ajustes',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Miembros',
    href: '/members',
    icon: UsersIcon
  }
]
