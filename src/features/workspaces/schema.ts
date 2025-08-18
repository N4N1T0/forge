import { z } from 'zod'

export const createWorkspacesSchema = z.object({
  name: z.string().trim().min(1, 'El Nombre es requerido'),
  image: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= 1024 * 1024,
          'La imagen debe ser menor de 1MB'
        ),
      z.string().transform((value) => (value === '' ? undefined : value))
    ])
    .optional()
})

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, 'Debe ser mayor a 1 carácter').optional(),
  image: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= 1024 * 1024,
          'La imagen debe ser menor de 1MB'
        ),
      z.string().transform((value) => (value === '' ? undefined : value))
    ])
    .optional()
})
