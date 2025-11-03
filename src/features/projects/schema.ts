import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'The Name is required'),
  workspaceId: z.string().trim().min(1, 'The Workspace is required'),
  shortcut: z.string().trim(),
  description: z.string().trim().optional()
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema>
