'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer/drawer'
import { Separator } from '@/components/ui/separator'
import { status as statusData } from '@/data'
import { formatDate } from '@/features/tasks/utils'
import { Tasks } from '@/types/appwrite'
import { Fragment } from 'react'

interface TaskInfoViewProps {
  task: Tasks
  children?: React.ReactNode
}

export const TaskInfoView = ({ task, children }: TaskInfoViewProps) => {
  if (!task) return null

  const currentStatus = statusData.find((s) => s.value === task.status)
  const dueDate = task.dueDate ? formatDate(task.dueDate, 'PPP') : '—'

  return (
    <Drawer direction='right'>
      <DrawerTrigger asChild>
        {children ? (
          <Fragment>{children}</Fragment>
        ) : (
          <Button variant='outline' size='sm'>
            View details
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className='sm:max-w-md md:max-w-lg lg:max-w-xl'>
        <DrawerHeader>
          <div className='flex items-start justify-between gap-3'>
            <div className='grid gap-1'>
              <DrawerTitle className='text-base'>{task.name}</DrawerTitle>
              <DrawerDescription>Task information</DrawerDescription>
            </div>
            {currentStatus && (
              <Badge variant='outline' className='gap-2'>
                <span
                  className='inline-block size-2 rounded-full'
                  style={{ backgroundColor: currentStatus.color }}
                  aria-hidden='true'
                />
                {currentStatus.label}
              </Badge>
            )}
          </div>
        </DrawerHeader>

        <div className='px-4 pb-4 space-y-6'>
          {task.description && (
            <div className='grid gap-1'>
              <p className='text-sm font-medium'>Description</p>
              <p className='text-sm text-muted-foreground whitespace-pre-line'>
                {task.description}
              </p>
            </div>
          )}

          <Separator />

          <div className='grid gap-3'>
            <p className='text-sm font-medium'>Details</p>
            <div className='grid gap-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Project</span>
                <span className='text-sm font-medium'>
                  {task.projectId || '—'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Assignee</span>
                <span className='text-sm font-medium'>
                  {task.assignee?.name || task.assigneeId || 'Unassigned'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Due date</span>
                <span className='text-sm font-medium'>{dueDate}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Status</span>
                <span className='text-sm font-medium'>
                  {currentStatus?.label || '—'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Position</span>
                <span className='text-sm font-medium'>
                  {task.position ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='secondary'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
