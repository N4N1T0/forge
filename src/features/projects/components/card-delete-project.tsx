'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { useDeleteProject } from '@/features/projects/server/use-delete-project'
import { Projects } from '@/types/appwrite'

interface CardDeleteProjectProps {
  project: Projects
  onCancel?: () => void
}

const CardDeleteProject = ({ project, onCancel }: CardDeleteProjectProps) => {
  const [confirmationText, setConfirmationText] = useState('')
  const { mutate: deleteProject, isPending } = useDeleteProject()
  const router = useRouter()

  const requiredText = `${project.name.toLowerCase().split(' ').join('-')}-delete-project`
  const isConfirmationValid = confirmationText === requiredText

  const handleDelete = () => {
    if (!isConfirmationValid) return

    deleteProject(
      {
        param: { projectId: project.$id }
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/workspace/${project.workspaceId}`)
          onCancel?.()
        }
      }
    )
  }

  return (
    <Card className='border-destructive/50 bg-destructive/5'>
      <CardHeader>
        <CardTitle className='text-2xl md:text-3xl font-bold text-destructive'>
          Delete Project
        </CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>
          This action cannot be undone. This will permanently delete the project
          and all of its data.
        </CardDescription>
      </CardHeader>
      <Separator className='bg-destructive/50' />
      <CardContent className='pt-2.5 flex flex-col gap-y-5'>
        <div className='space-y-2'>
          <Label htmlFor='confirmation' className='text-sm font-medium'>
            To confirm deletion, type{' '}
            <code className='bg-muted px-1 py-0.5 rounded text-xs font-mono'>
              {requiredText}
            </code>{' '}
            below:
          </Label>
          <Input
            id='confirmation'
            type='text'
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={requiredText}
            className='font-mono text-sm'
            disabled={isPending}
          />
        </div>

        <Separator className='bg-destructive/50' />

        <CardFooter className='flex justify-end items-center gap-3 flex-wrap px-0'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isPending}
            className='flex-1'
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={!isConfirmationValid || isPending}
            className='flex-1'
          >
            {isPending ? 'Deleting...' : 'Delete Project'}
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default CardDeleteProject
