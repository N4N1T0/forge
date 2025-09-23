import { formatTaskDate } from '@/features/tasks/utils'

// TYPES
interface TaskDateCellProps {
  date: string
}

export const TaskDateCell = ({ date }: TaskDateCellProps) => {
  const { formattedDate, textColor } = formatTaskDate(date)

  return (
    <div className={textColor}>
      <span className='truncate'>{formattedDate}</span>
    </div>
  )
}
