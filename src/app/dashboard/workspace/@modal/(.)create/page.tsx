'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import CreateWorkspacesForm from '@/features/workspaces/components/workspace-form'
import { useMedia } from '@/hooks/use-media'
import { useRouter } from 'next/navigation'

export default function ModalWorkspaceCreate() {
  const router = useRouter()
  const isDesktop = useMedia('(min-width: 768px)')

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  if (isDesktop) {
    return (
      <Dialog defaultOpen onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-[425px] pt-12'>
          <DialogHeader className='sr-only'>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your projects and collaborate
              with your team.
            </DialogDescription>
          </DialogHeader>
          <CreateWorkspacesForm onCancel={() => handleOpenChange} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open onOpenChange={handleOpenChange}>
      <DrawerContent className='px-2 h-[90vh]'>
        <DrawerHeader className='sr-only'>
          <DrawerTitle>Create Workspace</DrawerTitle>
          <DrawerDescription>
            Create a new workspace to organize your projects and collaborate
            with your team.
          </DrawerDescription>
        </DrawerHeader>
        <div className='my-auto'>
          <CreateWorkspacesForm onCancel={() => handleOpenChange} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
