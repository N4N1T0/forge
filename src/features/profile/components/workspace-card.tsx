'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Icon, IconName } from '@/components/ui/icon-picker'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useLeaveWorkspace } from '@/features/profile/hooks/use-leave-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { Role, Workspaces } from '@/types/appwrite'
import { LogOut } from 'lucide-react'

interface WorkspaceCardProps {
  workspace: Workspaces
  userRole: Role
  isLastAdmin: boolean
}

export function WorkspaceCard({
  workspace,
  userRole,
  isLastAdmin
}: WorkspaceCardProps) {
  const { mutate: leaveWorkspace, isPending } = useLeaveWorkspace()

  const [confirmLeave, LeaveDialog] = useConfirm(
    'Leave workspace',
    `Are you sure you want to leave "${workspace.name}"? This action cannot be undone.`,
    'destructive'
  )

  const handleLeave = async () => {
    const confirmed = await confirmLeave()
    if (confirmed) {
      leaveWorkspace({ param: { workspaceId: workspace.$id } })
    }
  }

  const roleLabel = userRole === Role.ADMIN ? 'Admin' : 'Member'
  const roleVariant = userRole === Role.ADMIN ? 'default' : 'secondary'

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center size-12 rounded-md bg-muted'>
                {workspace.icon && (
                  <Icon name={workspace.icon as IconName} className='size-6' />
                )}
              </div>
              <div>
                <CardTitle className='text-base'>{workspace.name}</CardTitle>
                {workspace.description && (
                  <CardDescription className='line-clamp-1'>
                    {workspace.description}
                  </CardDescription>
                )}
              </div>
            </div>
            <Badge variant={roleVariant}>{roleLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex justify-end'>
            {isLastAdmin ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant='destructive'
                      size='sm'
                      disabled
                      className='gap-2'
                    >
                      <LogOut className='size-4' />
                      Leave
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    You cannot leave because you are the last administrator.
                    <br />
                    Assign another administrator first.
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant='destructive'
                size='sm'
                onClick={handleLeave}
                disabled={isPending}
                className='gap-2'
              >
                <LogOut className='size-4' />
                {isPending ? 'Leaving...' : 'Leave'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <LeaveDialog />
    </>
  )
}
