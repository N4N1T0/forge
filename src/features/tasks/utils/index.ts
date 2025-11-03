import { sanitizeHtml } from '@/lib/utils'
import { differenceInDays, format } from 'date-fns'

// CONST
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

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
export const formatDate = (
  date: string,
  formatString: string = 'dd MMM yyyy'
) => {
  return format(new Date(date), formatString)
}

/**
 * Checks if a user has exceeded the rate limit for comments
 * @param userId - The unique identifier of the user
 * @returns True if the user is within rate limits, false if they have exceeded the limit
 */
export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now()
  const key = `comment_${userId}`
  const limit = rateLimitStore.get(key)

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return true
  }

  if (limit.count >= 10) {
    return false
  }

  limit.count++
  return true
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param content - The raw HTML content to sanitize
 * @returns The sanitized HTML content
 */
export const sanitizeContent = (content: string): string => {
  return sanitizeHtml(content)
}

/**
 * Extracts user mention IDs from HTML content
 * @param content - The HTML content containing mention elements
 * @returns An array of unique user IDs that were mentioned
 */
export const extractMentions = (content: string): string[] => {
  const mentionRegex = /data-mention-id="([^"]+)"/g
  const mentions: string[] = []
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1])
  }

  return [...new Set(mentions)] // Remove duplicates
}
