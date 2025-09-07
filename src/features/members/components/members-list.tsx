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
import { useGetMembers } from '@/features/members/server/use-get-members'
import { useGetCurrentWorkspace } from '@/features/workspaces/client/use-workspace-id'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { MemberAvatar } from './member-avatar'
import MemberMoreBtn from './member-more-btn'

const MembersList = () => {
  const { workspace } = useGetCurrentWorkspace()
  const router = useRouter()
  const { data: members, isLoading } = useGetMembers({
    workspaceId: workspace?.$id as string
  })
  console.log('🚀 ~ MembersList ~ members:', members)

  const handleCancel = () => {
    router.back()
  }

  return (
    <Card className='size-full shadow-none'>
      <CardHeader className=''>
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
        {/* LOADING SKELETON */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div className='flex items-center gap-2 mt-1' key={index}>
              <Skeleton className='size-10 rounded-full' />
              <div className='w-full max-w-48 flex flex-col gap-1'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-3 w-full' />
              </div>
              <Skeleton className='size-9 ml-auto' />
            </div>
          ))}

        {/* DATA */}
        {members?.map((member, index) => (
          <Fragment key={member?.$id}>
            <div className='flex items-center gap-2'>
              <MemberAvatar
                member={member}
                className={
                  member?.role === 'ADMIN' ? 'bg-red-500' : 'bg-green-500'
                }
              />
              <div className='flex flex-col'>
                <p className='text-sm font-medium'>
                  {member?.name ?? 'Unknown'}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {member?.role ?? 'Unknown'}
                </p>
              </div>
              {member?.userId !== workspace?.userId ? (
                <MemberMoreBtn member={member} />
              ) : (
                <Badge className='ml-auto'>OWNER</Badge>
              )}
            </div>
            {index < members.length - 1 && <Separator className='my-2.5' />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

export default MembersList
