import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useDeleteMember } from '@/features/members/hooks/use-delete-member'
import { useUpdateMember } from '@/features/members/hooks/use-update-member'
import { useConfirm } from '@/hooks/use-confirm'
import { Members, Role } from '@/types/appwrite'
import { MoreVerticalIcon } from 'lucide-react'

export const MemberMoreBtn = ({
  member
}: {
  member: (Members & { name: string; email: string }) | null
}) => {
  // HOOKS
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember()
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember()
  const [confirmDelete, DeleteWorkspaceModal] = useConfirm(
    'Remove member',
    'this member will be remove from the workspace',
    'destructive'
  )

  // HANDLERS
  const handleDelete = async () => {
    const ok = await confirmDelete()
    if (!ok) return

    if (member) {
      deleteMember({
        param: {
          memberId: member.$id
        }
      })
    }
  }

  const handleUpdate = (role: Role) => {
    if (member) {
      updateMember({
        param: {
          memberId: member.$id
        },
        json: {
          role
        }
      })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='ml-auto' variant='secondary' size='icon'>
            <MoreVerticalIcon className='size-4 text-muted-foreground' />
            <span className='sr-only'>Open Member menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' side='bottom'>
          <DropdownMenuItem
            className='font-medium'
            onClick={() => handleUpdate(Role.ADMIN)}
            disabled={isDeleting || isUpdating}
          >
            Set as Administrator
          </DropdownMenuItem>
          <DropdownMenuItem
            className='font-medium'
            onClick={() => handleUpdate(Role.MEMBER)}
            disabled={isDeleting || isUpdating}
          >
            Set as Member
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='font-medium text-destructive'
            onClick={() => handleDelete()}
            disabled={isDeleting || isUpdating}
          >
            Remove {member?.name}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteWorkspaceModal />
    </>
  )
}
