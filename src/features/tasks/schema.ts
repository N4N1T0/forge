import { Status } from '@/types/appwrite'
import z from 'zod'

// SCHEMAS
export const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  assigneeId: z.string().trim().min(1, 'Assignee ID is required'),
  dueDate: z.string(),
  status: z.enum(Status)
})

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment content cannot exceed 2000 characters'),
  mentions: z.array(z.string()).optional().default([])
})

export const getCommentsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(20)
})

// TYPES
export type CreateCommentSchema = z.infer<typeof createCommentSchema>
export type GetCommentsSchema = z.infer<typeof getCommentsSchema>
export type CreateTaskSchema = z.infer<typeof createTaskSchema>
