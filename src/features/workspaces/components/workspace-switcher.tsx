'use client'

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar'
import { useGetWorkspaces } from '@/features/workspaces/server/use-current-workspace'
import { SelectItem } from '@radix-ui/react-select'
import { CirclePlus } from 'lucide-react'

export const WorkspaceSwitcher = () => {
  const { data, isLoading } = useGetWorkspaces()

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex items-center justify-between'>
        <p className='text-xs uppercase text-primary'>WorkSpaces</p>
        <CirclePlus className='size-5 text-primary cursor-pointer hover:text-primary/70 transition-colors duration-100' />
      </div>
      <Select>
        <SelectTrigger className='w-full'>
          <SelectValue
            placeholder='No Workspace Selected'
            className='text-background'
          />
        </SelectTrigger>
        <SelectContent className='py-2 px-1 w-full'>
          {isLoading && (
            <SelectItem value='loading' disabled>
              Loading...
            </SelectItem>
          )}

          {!isLoading && data?.length === 0 && (
            <SelectItem value='no-workspace' disabled className='text-sm'>
              No Workspace Found
            </SelectItem>
          )}

          {!isLoading &&
            data?.map((workspace) => (
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
