'use client'

import CreateWorkspacesForm from '@/features/workspaces/components/workspace-form'
import { useRouter } from 'next/navigation'

export default function CreateWorkspace() {
  const router = useRouter()
  return (
    <CreateWorkspacesForm
      onCancel={() => {
        router.push('/dashboard')
      }}
    />
  )
}
