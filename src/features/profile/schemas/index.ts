import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot be more than 50 characters'),
  bio: z
    .string()
    .max(1000, 'Bio cannot be more than 1000 characters')
    .optional()
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(56, 'Password cannot be more than 56 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include at least one lowercase, one uppercase, and one number'
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const deleteAccountSchema = z.object({
  email: z.string().min(1, { error: 'Enter a valid email address' }),
  confirmation: z.string().refine((val) => val === 'Delete my account', {
    message: 'You must type "Delete my account" to confirm'
  })
})

export const verifyMFASchema = z.object({
  otp: z
    .string()
    .length(6, 'The code must be 6 digits')
    .regex(/^\d+$/, 'The code must contain only numbers')
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>
export type VerifyMFASchema = z.infer<typeof verifyMFASchema>
