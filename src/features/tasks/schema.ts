import { Status } from '@/types/appwrite'
import z from 'zod'

export const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  assigneeId: z.string().trim().min(1, 'Assignee ID is required'),
  dueDate: z.coerce.date(),
  status: z.enum(Status).default(Status.BACKLOG)
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>
