import { differenceInDays, format } from 'date-fns'

// TYPES
interface TaskDateCellProps {
  date: string
}

export const TaskDateCell = ({ date }: TaskDateCellProps) => {
  const today = new Date()
  const taskDate = new Date(date)
  const diffInDays = differenceInDays(taskDate, today)

  let textColor = 'text-muted-foreground'

  if (diffInDays < 3) {
    textColor = 'text-red-500'
  } else if (diffInDays <= 7) {
    textColor = 'text-orange-500'
  } else if (diffInDays <= 14) {
    textColor = 'text-yellow-500'
  }

  return (
    <div className={textColor}>
      <span className='truncate'>{format(taskDate, 'PPP')}</span>
    </div>
  )
}
