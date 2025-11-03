'use client'

import { Projects } from '@/types/appwrite'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface UseProjectShortcutsProps {
  projects: Projects[] | undefined
  workspaceId: string | undefined
}

export const useProjectShortcuts = ({
  projects,
  workspaceId
}: UseProjectShortcutsProps) => {
  const router = useRouter()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey
      if (!isMeta) return

      // Don't trigger when typing in inputs or editable content
      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName?.toLowerCase()
        const isTyping =
          tag === 'input' || tag === 'textarea' || target.isContentEditable
        if (isTyping) return
      }

      const key = event.key.toLowerCase()

      // Open Create Project Drawer on Cmd/Ctrl + '+' or Shift+='='
      const isPlus = key === '+' || (event.shiftKey && key === '=')
      if (isPlus) {
        event.preventDefault()
        window.dispatchEvent(new CustomEvent('forge:open-create-project'))
        return
      }

      // Navigate to project by shortcut
      if (!projects || !workspaceId) return
      const matched = projects.find((p) => p.shortcut?.toLowerCase() === key)
      if (matched) {
        event.preventDefault()
        router.push(
          `/dashboard/workspace/${workspaceId}/projects/${matched.$id}`
        )
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [projects, workspaceId, router])
}
