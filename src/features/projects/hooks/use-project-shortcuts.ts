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

      // DONT TRIGGER WHEN TYPING IN INPUTS OR EDITABLE CONTENT
      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName?.toLowerCase()
        const isTyping =
          tag === 'input' || tag === 'textarea' || target.isContentEditable
        if (isTyping) return
      }

      const key = event.key.toLowerCase()

      // OPEN CREATE PROJECT DRAWER ON CMD/CTRL + '+' OR SHIFT+='='
      const isPlus = key === '+' || (event.shiftKey && key === '=')
      if (isPlus) {
        event.preventDefault()
        window.dispatchEvent(new CustomEvent('forge:open-create-project'))
        return
      }

      // NAVIGATE TO PROJECT BY SHORTCUT
      if (!projects || !workspaceId) return
      const matched = projects.find((p) => p.shortcut?.toLowerCase() === key)
      if (matched) {
        event.preventDefault()
        router.push(`/workspace/${workspaceId}/projects/${matched.$id}`)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [projects, workspaceId, router])
}
