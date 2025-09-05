'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useGetMembers } from '@/features/members/server/use-get-members'
import { useWorkspaceId } from '@/features/workspaces/client/use-workspace-id'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { MemberAvatar } from './member-avatar'
import MemberMoreBtn from './member-more-btn'

const MembersList = () => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const { data: members } = useGetMembers({ workspaceId })

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
        {members?.map((member, index) => (
          <Fragment key={member?.$id}>
            <div className='flex items-center gap-2'>
              <MemberAvatar member={member} />
              <div className='flex flex-col'>
                <p className='text-sm font-medium'>
                  {member?.name ?? 'Unknown'}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {member?.email ?? 'Unknown'}
                </p>
              </div>
              <MemberMoreBtn member={member} />
            </div>
            {index < members.length - 1 && (
              <Separator className='bg-muted-foreground my-2' />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

export default MembersList
