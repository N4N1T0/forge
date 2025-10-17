import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es requerido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(56, 'La contraseña no puede tener más de 56 caracteres')
})

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede tener más de 50 caracteres'),
    email: z.string().min(1, 'El correo electrónico es requerido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(56, 'La contraseña no puede tener más de 56 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido')
})

export const updatePasswordSchema = z
  .object({
    userId: z.string().min(1),
    secret: z.string().min(1),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden'
  })

export const otpSchema = z.object({
  userId: z.string().min(1),
  secret: z.string().min(4, 'Código demasiado corto').max(10, 'Código inválido')
})

export type OtpFormData = z.infer<typeof otpSchema>
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
