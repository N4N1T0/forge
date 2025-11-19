'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { status as statusData } from '@/data'
import { useGetMembers } from '@/features/members'
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters'
import { useWorkspaceId } from '@/features/workspaces'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { Status } from '@/types/appwrite'
import { SelectSeparator } from '@radix-ui/react-select'
import { format } from 'date-fns'
import { CalendarIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const TaskFilters = () => {
  // HOOKS
  const workspaceId = useWorkspaceId()
  const {
    assigneeId,
    dueDate,
    search,
    status,
    setFilters,
    resetFilters,
    isAnyFilterActive
  } = useTaskFilters()

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId
  })

  // STATE
  const [localSearch, setLocalSearch] = useState(search || '')

  // DEBOUNCE
  const debouncedSearch = useDebounce(localSearch, 300)

  // CONST
  const isLoading = isLoadingMembers

  const membersOptions = members?.map((member) => ({
    label: member?.name || '-',
    value: member?.$id || '-'
  }))

  // EFFECTS
  useEffect(() => {
    setFilters({ search: debouncedSearch || null })
  }, [debouncedSearch, setFilters])

  useEffect(() => {
    setLocalSearch(search || '')
  }, [search])

  // HANDLERS
  const handleStatusChange = (value: string | undefined) => {
    setFilters({ status: value === 'all' ? null : (value as Status) })
  }
  const handleAssigneeChange = (value: string | undefined) => {
    setFilters({ assigneeId: value === 'all' ? null : (value as string) })
  }
  const handleDueDateChange = (value: Date | undefined) => {
    setFilters({ dueDate: value?.toISOString() })
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value)
  }
  const handleReset = () => {
    setLocalSearch('')
    resetFilters()
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center flex-1 px-5 gap-2'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='h-4 w-[100px]' />
        ))}
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center px-5 gap-2'>
      {/* SEARCH */}
      <Input
        placeholder='Search tasks'
        value={localSearch}
        onChange={handleSearchChange}
        className='w-full lg:w-auto'
      />

      {/* STATUS */}
      <Select
        defaultValue={status || undefined}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className='w-full lg:w-auto h-8'>
          <SelectValue placeholder='All Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Status</SelectItem>
          <SelectSeparator />
          {statusData.map(({ value, label, color }) => (
            <SelectItem key={value} value={value}>
              <svg
                width='6'
                height='6'
                fill='currentColor'
                viewBox='0 0 6 6'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
                style={{
                  color: color
                }}
              >
                <circle cx='3' cy='3' r='3' />
              </svg>
              <span className='truncate'>{label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ASSIGNEE */}
      <Select
        defaultValue={assigneeId || undefined}
        onValueChange={handleAssigneeChange}
      >
        <SelectTrigger className='w-full lg:w-auto h-8'>
          <SelectValue placeholder='All Assignees' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Assignees</SelectItem>
          <SelectSeparator />
          {membersOptions?.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              <span
                data-square
                className='bg-muted text-muted-foreground flex size-5 items-center justify-center rounded text-xs font-medium'
                aria-hidden='true'
              >
                {label.charAt(0)}
              </span>
              <span className='truncate'>{label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* DUE DATE */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-full lg:w-auto pl-3 text-left font-normal',
              !dueDate && 'text-muted-foreground'
            )}
          >
            {dueDate ? format(new Date(dueDate), 'PPP') : <span>Due Date</span>}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={dueDate ? new Date(dueDate) : undefined}
            onSelect={handleDueDateChange}
          />
        </PopoverContent>
      </Popover>

      {/* RESET BUTTON */}
      {isAnyFilterActive && (
        <Button variant='ghost' size='sm' className='h-9' onClick={handleReset}>
          <XIcon /> Reset
        </Button>
      )}
    </div>
  )
}
