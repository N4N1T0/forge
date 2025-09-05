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
 * Generates a random invite code of specified length using alphanumeric characters
 * @param length - The desired length of the invite code
 * @returns A random string containing uppercase letters, numbers and some lowercase letters
 * @throws {Error} If length is less than 1
 * @example
 * ```ts
 * const code = generateInviteCode(8); // Returns e.g. "X7kNP9aY"
 * ```
 */
export const generateInviteCode = (length: number): string => {
  if (length < 1) {
    throw new Error('Invite code length must be at least 1')
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopq'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
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
