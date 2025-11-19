'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useCurrentMember } from '@/features/members'
import { useDeleteWorkspace } from '@/features/workspaces/server/use-delete-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { checkIsOwner } from '@/lib/utils'
import { Workspaces } from '@/types/appwrite'
import { useRouter } from 'next/navigation'

// TYPES
interface WorkspaceDangerZoneProps {
  initialValues: Workspaces
}

export const WorkspaceDangerZone = ({
  initialValues
}: WorkspaceDangerZoneProps) => {
  // HOOKS
  const router = useRouter()
  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useCurrentMember()
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace()
  const [confirmDelete, DeleteWorkspaceModal] = useConfirm(
    'Eliminar Espacio de Trabajo',
    '¿Estás seguro de eliminar este espacio de trabajo?',
    'destructive'
  )

  // HANDLERS
  const handleDelete = async () => {
    const ok = await confirmDelete()
    if (!ok) {
      return null
    }

    deleteWorkspace(
      { param: { workspaceId: initialValues?.$id } },
      {
        onSuccess: () => {
          router.replace('/dashboard')
        }
      }
    )
  }

  // CONST
  const isDeleting = isDeletingWorkspace || isCurrentMemberLoading

  // RENDER
  if (!checkIsOwner(currentMember, initialValues)) {
    return null
  }

  return (
    <>
      {/* DELETE CARD */}
      <Card className='max-w-2xl border-destructive col-span-2 h-fit'>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Deleting a workspace is irreversible and will remove all associated
            data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner /> : 'Delete Workspace'}
          </Button>
        </CardContent>
      </Card>

      {/* DELETE MODAL */}
      <DeleteWorkspaceModal />
    </>
  )
}
