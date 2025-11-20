import { status } from '@/data'
import { cn } from '@/lib/utils'
import { DataCalendarFormattedEvents } from '@/types'

// TYPES
interface DataCalendarEventCardProps {
  event: DataCalendarFormattedEvents
}

export const DataCalendarEventCard = ({
  event
}: DataCalendarEventCardProps) => {
  // CONST
  const { title, status: statusValue } = event

  return (
    <div
      className={cn(
        'p-1 text-xs bg-background text-foreground border border-muted-foreground border-l-8 flex flex-col gap-y-1 cursor-pointer hover:opacity-85 transition-opacity truncate'
      )}
      style={{
        borderLeftColor: status.find((item) => item.value === statusValue)
          ?.color
      }}
    >
      <p>{title}</p>
    </div>
  )
}
