'use client'

import ResponsiveModal from '@/components/ui/responsive-modal'
import CreateWorkspacesForm from '@/features/workspaces/components/workspace-form'
import { useRouter } from 'next/navigation'

export default function ModalWorkspaceCreate() {
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <ResponsiveModal
      open
      onOpenChange={handleOpenChange}
      title='Create Workspace'
      description='Create a new workspace to organize your projects and collaborate with your team.'
      hideHeader
    >
      <CreateWorkspacesForm onCancel={() => handleOpenChange(false)} />
    </ResponsiveModal>
  )
}
