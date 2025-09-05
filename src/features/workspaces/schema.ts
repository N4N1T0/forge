import { IconName } from '@/components/ui/icon-picker'
import { z } from 'zod'

export const createWorkspacesSchema = z.object({
  name: z.string().trim().min(1, 'El Nombre es requerido'),
  description: z.string().trim().min(1, 'La Descripción es requerida'),
  icon: z.custom<IconName>((val) => typeof val === 'string'),
  slug: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional()
})

export type CreateWorkspacesSchema = z.infer<typeof createWorkspacesSchema>
