'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useWorkspaceId } from '@/features/workspaces/client/use-workspace-id'
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar'
import { useGetWorkspaces } from '@/features/workspaces/server/use-current-workspace'
import { CirclePlus, Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const WorkspaceSwitcher = () => {
  // STATE
  const router = useRouter()
  const initialWorkspaceId = useWorkspaceId()
  const { data: workspaces, isLoading } = useGetWorkspaces()
  const [selectedWorkspace, setSelectedWorkspace] = useState<
    string | undefined
  >(initialWorkspaceId)

  useEffect(() => {
    setSelectedWorkspace(initialWorkspaceId)
  }, [initialWorkspaceId])

  // HANDLER
  const handlerOnselect = (value: string) => {
    setSelectedWorkspace(value)
    router.push(`/dashboard/workspace/${value}`)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex items-center justify-between'>
        <p className='text-xs uppercase text-primary'>WorkSpaces</p>
        <Link href='/dashboard/workspace/create'>
          <CirclePlus className='size-5 text-primary cursor-pointer hover:text-primary/70 transition-colors duration-100' />
        </Link>
      </div>
      <Select onValueChange={handlerOnselect} value={selectedWorkspace || ''}>
        <SelectTrigger className='w-full !h-fit'>
          <SelectValue
            placeholder='No Workspace Selected'
            className='text-background'
          />
        </SelectTrigger>
        <SelectContent className='py-2 px-1 w-full'>
          {isLoading && (
            <SelectItem value='loading' disabled>
              <Loader className='size-4 animate-spin' />
              <span>Loading...</span>
            </SelectItem>
          )}

          {!isLoading && workspaces?.length === 0 && (
            <SelectItem value='no-workspace' disabled className='text-sm'>
              No Workspace Found
            </SelectItem>
          )}

          {!isLoading &&
            workspaces?.map((workspace) => (
              <SelectItem
                key={workspace.$id}
                value={workspace.$id}
                className='my-1'
              >
                <div className='flex justify-start items-center hover:bg-primary/50 rounded-lg transition-colors duration-100 ease-in'>
                  <WorkspaceAvatar workspace={workspace} />
                  <span className='ml-2'>{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}
