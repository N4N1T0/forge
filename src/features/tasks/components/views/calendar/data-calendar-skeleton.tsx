import { Skeleton } from '@/components/ui/skeleton'

export const DataCalendarSkeleton = () => {
  // CONST
  const weekdayHeaders = Array.from({ length: 7 }).map((_, i) => (
    <div key={`weekday-${i}`} className='px-2 py-2'>
      <Skeleton className='h-4 w-16' />
    </div>
  ))

  const weeks = Array.from({ length: 5 })
  const daysPerWeek = Array.from({ length: 7 })

  return (
    <section className='pt-4 size-full'>
      {/* TOOLBAR */}
      <div className='flex items-center justify-between gap-2 mb-3'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-16 rounded-md' />
          <Skeleton className='h-8 w-16 rounded-md' />
          <Skeleton className='h-8 w-16 rounded-md' />
        </div>
      </div>

      {/* WEEKDAY */}
      <div className='grid grid-cols-7 gap-px rounded-md overflow-hidden border bg-border'>
        {weekdayHeaders}
      </div>

      {/* MONTH */}
      <div className='mt-px grid grid-rows-6 rounded-md overflow-hidden border bg-border'>
        {weeks.map((_, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className='grid grid-cols-7 gap-px bg-border'
          >
            {daysPerWeek.map((__, dayIndex) => (
              <div
                key={`day-${weekIndex}-${dayIndex}`}
                className='bg-card border rounded-md p-2 min-h-28 flex flex-col gap-2'
              ></div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
