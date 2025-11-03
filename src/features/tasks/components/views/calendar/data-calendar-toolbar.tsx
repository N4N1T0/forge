import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { NavigateAction } from 'react-big-calendar'

interface DataCalendarToolbarProps {
  date: Date
  onNavigate: (navigate: NavigateAction, date?: Date) => void
}

export const DataCalendarToolbar = ({
  date,
  onNavigate
}: DataCalendarToolbarProps) => {
  return (
    <div className='px-3 pb-2 flex gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-between'>
      <div className='flex gap-x-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onNavigate('PREV', date)}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onNavigate('NEXT', date)}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onNavigate('TODAY', date)}
        >
          <CalendarIcon />
        </Button>
      </div>

      <p className='text-lg font-medium'>
        {format(date, 'LLLL yyyy')} |{' '}
        <span className='underline'>Due Dates</span>
      </p>
    </div>
  )
}
