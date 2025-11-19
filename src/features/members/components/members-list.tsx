'use client'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useCurrentMember, useGetMembers } from '@/features/members/hooks'
import { useGetCurrentWorkspace } from '@/features/workspaces/hooks'
import { checkIsOwner } from '@/lib/utils'
import { Members } from '@/types/appwrite'
import { MemberItem } from '.'

// SKELETON
const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-8 rounded-full' />
            <Skeleton className='h-4 w-32' />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-40' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-20' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-48' />
        </TableCell>
        <TableCell className='text-right'>
          <Skeleton className='h-8 w-16 ml-auto' />
        </TableCell>
      </TableRow>
    ))}
  </>
)

export const MembersList = () => {
  // HOOKS
  const { workspace } = useGetCurrentWorkspace()
  const { data: members, isLoading } = useGetMembers({
    workspaceId: workspace?.$id as string
  })
  const { data: currentMember } = useCurrentMember()

  // CONST
  const checkMoreBtnAvailability = (
    member: (Members & { name: string; email: string }) | null
  ) => {
    return (
      member?.userId !== workspace?.userId && currentMember?.role === 'ADMIN'
    )
  }

  return (
    <div className='size-full'>
      <header className='border-b pb-4'>
        <h1 className='text-2xl font-bold tracking-tight'>Members</h1>
        <p className='text-muted-foreground'>Workspace members list</p>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            members?.map((member, index) => (
              <MemberItem
                key={member?.$id}
                member={member}
                isLast={index === members.length - 1}
                canUseMoreBtn={checkMoreBtnAvailability(member)}
                isOwner={checkIsOwner(member, workspace)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
