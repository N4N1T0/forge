import ResponsiveModal from '@/components/ui/responsive-modal'
import { ResponsiveModalProps } from '@/types'
import React, { Ref, useState } from 'react'
import CreateWorkspacesForm from './workspace-form'

export const ModalWorkspaceForm = React.forwardRef(
  ({ children, className }: ResponsiveModalProps, ref: Ref<HTMLDivElement>) => {
    const [isOpen, setIsOpen] = useState(false)

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
