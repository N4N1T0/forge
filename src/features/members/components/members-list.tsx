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
import { useWorkspaceId } from '@/features/workspaces/client/use-workspace-id'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { useGetMembers } from '../server/use-get-members'
import { MemberAvatar } from './member-avatar'

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
            Cancelar
          </Button>
          <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
            Lista de miembros
          </CardTitle>
        </div>
        <CardDescription className='text-sm md:text-base text-muted-foreground'>
          Lista de miembros del espacio de trabajo.
        </CardDescription>
      </CardHeader>
      <Separator variant='dashed' className='bg-muted-foreground' />
      <CardContent>
        {members?.map((member) => (
          <Fragment key={member.$id}>
            <div className='flex items-center gap-2'>
              <MemberAvatar member={member} />
            </div>
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

export default MembersList
