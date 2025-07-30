'use client'

import CreateWorkspacesForm from '@/features/workspaces/components/workspace-form'

export default function HomePage() {
  return (
    <div>
      <CreateWorkspacesForm onCancel={() => {}} />
    </div>
  )
}
