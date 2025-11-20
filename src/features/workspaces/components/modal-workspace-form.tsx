'use client'

import ResponsiveModal from '@/components/ui/modal/responsive-modal'
import { CreateWorkspacesForm } from '@/features/workspaces'
import { ResponsiveModalProps } from '@/types'
import { forwardRef, Ref, useState } from 'react'

export const ModalWorkspaceForm = forwardRef(
  ({ children, className }: ResponsiveModalProps, ref: Ref<HTMLDivElement>) => {
    // STATES
    const [isOpen, setIsOpen] = useState(false)

    // HANDLERS
    const handleClose = () => {
      setIsOpen(false)
    }

    return (
      <>
        <div ref={ref} onClick={() => setIsOpen(true)} className={className}>
          {children}
        </div>
        <ResponsiveModal
          open={isOpen}
          onOpenChange={() => setIsOpen(false)}
          title='Create a new workspace'
          description='A responsive modal/vault for creating a new workspace'
          hideHeader={true}
        >
          <CreateWorkspacesForm onCancel={handleClose} />
        </ResponsiveModal>
      </>
    )
  }
)

ModalWorkspaceForm.displayName = 'ModalWorkspaceForm'
