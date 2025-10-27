import { Button } from '@/components/ui/button'
import { status } from '@/data'
import { TaskAction } from '@/features/tasks/components/views'
import { sanitizeHtml } from '@/lib/utils'
import { FormattedTasks } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { TaskDateCell } from './task-cell-date'

export const TaskTableColumns: ColumnDef<FormattedTasks[number]>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.original.name || row.original.project?.name

      return <p className='line-clamp-1'>{name}</p>
    }
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Description
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const description = row.original.description
      const formattedDescription = sanitizeHtml(description)

      return <p className='line-clamp-1'>{formattedDescription}</p>
    }
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate

      return <TaskDateCell date={dueDate} />
    }
  },
  {
    accessorKey: 'assigneeId',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Assignee
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.original.assignee?.name || 'Unassigned'

      return (
        <div className='flex items-center gap-2 y-1.5 pr-8 pl-2'>
          <span
            data-square
            className='bg-muted text-muted-foreground flex size-5 items-center justify-center rounded text-xs font-medium'
            aria-hidden='true'
          >
            {name.charAt(0)}
          </span>
          <span className='truncate'>{name}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const originalStatus = row.original.status || 'Unassigned'
      const cellStatus = status.find((item) => item.value === originalStatus)

      return (
        <div className='flex items-center gap-2 y-1.5 pr-8 pl-2'>
          <svg
            width='6'
            height='6'
            fill='currentColor'
            viewBox='0 0 6 6'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
            style={{
              color: cellStatus?.color
            }}
          >
            <circle cx='3' cy='3' r='3' />
          </svg>
          <span className='truncate'>{cellStatus?.label}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const task = row.original

      return (
        <TaskAction task={task}>
          <Button variant='ghost' size='sm'>
            <MoreHorizontal className='size-4' />
          </Button>
        </TaskAction>
      )
    }
  }
]
