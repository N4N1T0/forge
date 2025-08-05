import { z } from 'zod'

export const createWorkspacesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
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
