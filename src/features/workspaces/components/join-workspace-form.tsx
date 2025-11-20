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
import { useJoinWorkspace } from '@/features/workspaces/hooks/use-join-workspace'
import { JoinWorkspaceFormProps } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
  // CONST
  const { name, inviteCode, workspaceId } = initialValues

  // HOOKS
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace()
  const router = useRouter()

  // HANDLERS
  const handlerJoinWorkspace = () => {
    joinWorkspace(
      {
        json: { code: inviteCode || '' },
        param: { workspaceId: workspaceId || '' }
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/workspace/${workspaceId}`)
        }
      }
    )
  }

  return (
    <Card className='shadow-none max-w-lg mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
          Join Workspace
        </CardTitle>
        <CardDescription>
          You have been invited to workspace <strong>{name}</strong>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className='flex justify-between items-center flex-col md:flex-row gap-2'>
          <Button
            className='w-full md:w-fit'
            variant='secondary'
            size='lg'
            disabled={isPending}
            asChild
          >
            <Link href='/dashboard'>Cancel</Link>
          </Button>
          <Button
            className='w-full md:w-fit'
            size='lg'
            onClick={handlerJoinWorkspace}
            disabled={isPending}
          >
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default JoinWorkspaceForm
