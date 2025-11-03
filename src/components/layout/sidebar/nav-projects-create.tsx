import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import ModalProjectForm from '@/features/projects/components/modal-project-form'
import { Plus } from 'lucide-react'

export const NavProjectCreate = () => {
  return (
    <ModalProjectForm className='w-full'>
      <SidebarMenuButton
        tooltip='Create project'
        className='w-full flex justify-between'
        variant='primary'
      >
        <span className='flex gap-2 justify-center items-center w-fit'>
          <Plus className='size-3' /> Create project
        </span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>+</Kbd>
        </KbdGroup>
      </SidebarMenuButton>
    </ModalProjectForm>
  )
}
