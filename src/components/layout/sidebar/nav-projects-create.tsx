import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { ModalProjectForm } from '@/features/projects'
import { Plus } from 'lucide-react'

export const NavProjectCreate = () => {
  return (
    <ModalProjectForm className='w-full'>
      <SidebarMenuButton
        tooltip='Create project'
        className='w-full'
        variant='outline'
      >
        <Plus className='size-3' /> Create project
        <KbdGroup className='ml-auto'>
          <Kbd>⌘</Kbd>
          <Kbd>+</Kbd>
        </KbdGroup>
      </SidebarMenuButton>
    </ModalProjectForm>
  )
}
