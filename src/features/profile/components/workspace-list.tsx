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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useGetProfile } from '@/features/profile/hooks/use-get-profile'
import { useLeaveWorkspace } from '@/features/profile/hooks/use-leave-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { Role } from '@/types/appwrite'
import { Loader, LogOut } from 'lucide-react'

export function WorkspaceList() {
  const { data: profile, isLoading } = useGetProfile()
  const { mutate: leaveWorkspace, isPending: isLeavingWorkspace } =
    useLeaveWorkspace()

  const [confirmLeave, LeaveDialog] = useConfirm(
    'Leave workspace',
    'Are you sure you want to leave this workspace? This action cannot be undone.',
    'destructive'
  )

  const handleLeave = async (workspaceId: string) => {
    const confirmed = await confirmLeave()
    if (confirmed) {
      leaveWorkspace({ param: { workspaceId } })
    }
  }

  if (isLoading) {
    return (
      <Card className='col-span-1 md:col-span-5'>
        <CardHeader>
          <CardTitle>My workspaces</CardTitle>
          <CardDescription>Manage your workspace memberships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <Loader className='size-6 animate-spin text-muted-foreground' />
          </div>
        </CardContent>
      </Card>
    )
  }

  const workspaces = profile?.workspaces || []
  const sortedWorkspaces = [...workspaces].sort((a, b) =>
    (a.workspace.name || '').localeCompare(b.workspace.name || '')
  )

  return (
    <div className='col-span-1 md:col-span-5'>
      <Card>
        <CardHeader>
          <CardTitle>My workspaces</CardTitle>
          <CardDescription>Manage your workspace memberships</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedWorkspaces.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>
                You do not belong to any workspace
              </p>
              <p className='text-muted-foreground text-sm mt-1'>
                Create a new one or join an existing one to get started
              </p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className='w-[120px]'>Role</TableHead>
                    <TableHead className='w-[100px] text-right'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedWorkspaces.map(({ workspace, role, isLastAdmin }) => {
                    const roleLabel = role === Role.ADMIN ? 'Admin' : 'Member'
                    const roleVariant =
                      role === Role.ADMIN ? 'default' : 'secondary'

                    return (
                      <TableRow key={workspace.$id}>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <div className='flex items-center justify-center size-10 rounded-md bg-muted shrink-0'>
                              {workspace.icon && (
                                <Icon
                                  name={workspace.icon as IconName}
                                  className='size-5'
                                />
                              )}
                            </div>
                            <span className='font-medium'>
                              {workspace.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className='text-muted-foreground text-sm line-clamp-1'>
                            {workspace.description || '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={roleVariant}>{roleLabel}</Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          {isLastAdmin ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    disabled
                                    className='gap-2'
                                  >
                                    <LogOut className='size-4' />
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  You cannot leave because you are the last
                                  administrator.
                                  <br />
                                  Assign another administrator first.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleLeave(workspace.$id)}
                              disabled={isLeavingWorkspace}
                              className='gap-2'
                            >
                              <LogOut className='size-4' />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <LeaveDialog />
    </div>
  )
}
