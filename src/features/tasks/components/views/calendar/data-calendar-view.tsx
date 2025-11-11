'use client'

import { ModalTaskInfo } from '@/features/tasks/components/info'
import {
  DataCalendarEventCard,
  DataCalendarSkeleton,
  DataCalendarToolbar
} from '@/features/tasks/components/views/calendar'
import {
  TaskEmptySearchView,
  TaskEmptyView
} from '@/features/tasks/components/views/empty'
import { useTaskFilters, useTaskViewModal } from '@/features/tasks/hooks'
import { DataCalendarFormattedEvents, DataViewProps } from '@/types'
import { Tasks } from '@/types/appwrite'
import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths
} from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useCallback, useState } from 'react'
import { Calendar, dateFnsLocalizer, NavigateAction } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { TaskViewError } from '../task-view-error'

type DataCalendarViewProps = DataViewProps

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
  locales
})

export const DataCalendarView = ({
  data,
  isLoading,
  error = false,
  refetch
}: DataCalendarViewProps) => {
  // STATE
  const [selectedTask, setSelectedTask] = useState<Tasks | undefined>(undefined)
  const { isAnyFilterActive } = useTaskFilters()
  const { handleOpen } = useTaskViewModal()
  const [value, setValue] = useState(
    data && data?.length > 0 ? new Date(data?.[0].dueDate) : new Date()
  )

  // CONST
  const events: DataCalendarFormattedEvents[] | undefined = data?.map(
    (item) => ({
      title: item.name,
      project: item.project,
      status: item.status,
      id: item.$id,
      task: item,
      assignee: item.assignee,
      start: new Date(item.dueDate),
      end: new Date(item.dueDate)
    })
  )

  // HANDLERS
  const handlerNavigate = useCallback(
    (action: NavigateAction) => {
      if (action === 'TODAY') {
        setValue(new Date())
      } else {
        setValue(action === 'PREV' ? subMonths(value, 1) : addMonths(value, 1))
      }
    },
    [value]
  )
  const handlerSelectEvent = useCallback(
    (event: DataCalendarFormattedEvents) => {
      const task = data?.find((item) => item.$id === event.id)
      setSelectedTask(task)
      handleOpen(event.id)
    },
    [data, handleOpen]
  )

  // RENDER
  if (isLoading) {
    return <DataCalendarSkeleton />
  }

  if (error && !isLoading) {
    return <TaskViewError handleRetry={refetch} />
  }

  if ((!data || data.length === 0) && !isAnyFilterActive) {
    return <TaskEmptyView />
  }

  if ((!data || data.length === 0) && isAnyFilterActive) {
    return <TaskEmptySearchView />
  }

  return (
    <>
      {selectedTask && <ModalTaskInfo task={selectedTask} />}

      <Calendar
        localizer={localizer}
        date={value}
        events={events}
        views={['month']}
        defaultView='month'
        onNavigate={(_date, _view, action) => handlerNavigate(action)}
        toolbar={true}
        onSelectEvent={handlerSelectEvent}
        showAllEvents={true}
        className='h-full'
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        components={{
          event: (props) => <DataCalendarEventCard {...props} />,
          toolbar: (props) => <DataCalendarToolbar {...props} />
        }}
        formats={{
          weekdayFormat: (date, culture, localizer) =>
            localizer?.format(date, 'eee', culture) ?? ''
        }}
      />
    </>
  )
}
