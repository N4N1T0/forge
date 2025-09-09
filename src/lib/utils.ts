import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class values into a single className string using clsx and tailwind-merge
 * @param inputs - Array of class values to be combined
 * @returns Merged and deduplicated className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a slug from a given name.
 *
 * @param {string} name - The name to generate the slug from.
 * @return {string} The generated slug.
 */
export const generateSlug = (name: string): string => {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')

  return slug
}

/**
 * Generates initials from a given name and last names.
 *
 * @param {string} name - The full name to generate initials from.
 * @return {string} The generated initials from first name and last names.
 */
export const getInitials = (name: string | undefined): string => {
  if (!name) return ''

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2) // Take first two initials (first name and first last name)
    .join('')
}
