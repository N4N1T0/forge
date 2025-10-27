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
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentMember } from '@/features/members/server/use-current-member'
import { useGetMembers } from '@/features/members/server/use-get-members'
import { useGetCurrentWorkspace } from '@/features/workspaces/hooks/use-workspace-id'
import { checkIsOwner } from '@/lib/utils'
import { Members } from '@/types/appwrite'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Models } from 'node-appwrite'
import { Fragment, useCallback } from 'react'
import { MemberAvatar } from './member-avatar'
import MemberMoreBtn from './member-more-btn'

// INTERFACES
interface MemberItemProps {
  member: (Members & Models.User<Models.Preferences>) | null
  isLast: boolean
  canUseMoreBtn: boolean
  isOwner: boolean
}

// SKELETON
const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 3 }).map((_, index) => (
      <div className='flex items-center gap-2 mt-1' key={index}>
        <Skeleton className='size-10 rounded-full' />
        <div className='w-full max-w-48 flex flex-col gap-1'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-3 w-full' />
        </div>
        <Skeleton className='size-9 ml-auto' />
      </div>
    ))}
  </>
)

const MemberItem = ({
  member,
  isLast,
  canUseMoreBtn,
  isOwner
}: MemberItemProps) => {
  if (!member) return null

  return (
    <Fragment key={member.$id}>
      <div className='flex items-center gap-2'>
        <MemberAvatar member={member} />
        <div className='flex flex-col'>
          <p className='text-sm font-medium'>{member.name ?? 'Unknown'}</p>
          <p className='text-xs text-muted-foreground'>
            {member.role ?? 'Unknown'}
          </p>
        </div>
        {canUseMoreBtn && <MemberMoreBtn member={member} />}
        {isOwner && <Badge className='ml-auto'>OWNER</Badge>}
      </div>
      {!isLast && <Separator className='my-2.5' />}
    </Fragment>
  )
}

const MembersList = () => {
  // HOOKS
  const { workspace } = useGetCurrentWorkspace()
  const router = useRouter()
  const { data: members, isLoading } = useGetMembers({
    workspaceId: workspace?.$id as string
  })
  const { data: currentMember } = useCurrentMember()

  // HANDLERS
  const handleCancel = useCallback(() => {
    router.back()
  }, [router])

  // CONST
  const checkMoreBtnAvailability = (
    member: (Members & { name: string; email: string }) | null
  ) => {
    return (
      member?.userId !== workspace?.userId && currentMember?.role === 'ADMIN'
    )
  }

  return (
    <Card className='size-full shadow-none'>
      <CardHeader>
        <div className='flex items-center flex-row gap-x-4'>
          <Button size='sm' variant='secondary' onClick={handleCancel}>
            <ArrowLeftIcon className='size-4' />
            Cancel
          </Button>
          <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
            Members List
          </CardTitle>
        </div>
        <CardDescription className='text-sm md:text-base text-muted-foreground'>
          Workspace members list.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
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
      </CardContent>
    </Card>
  )
}

export default MembersList
