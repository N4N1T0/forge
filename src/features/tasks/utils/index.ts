import { differenceInDays, format } from 'date-fns'

/**
 * Formats a date with color coding based on how close it is to today
 * @param date - The date string to format
 * @returns An object containing the formatted date and appropriate CSS color class
 */
export const formatTaskDate = (date: string) => {
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

  return {
    formattedDate: format(taskDate, 'PPP'),
    textColor,
    date: taskDate
  }
}

/**
 * Simple date formatter for display purposes
 * @param date - The date string to format
 * @param formatString - The format string (defaults to 'dd MMM yyyy')
 * @returns The formatted date string
 */
export const formatDate = (date: string, formatString: string = 'dd MMM yyyy') => {
  return format(new Date(date), formatString)
}