/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  TASKS_COLLECTION_ID
} from '@/config'
import {
  MemberSummary,
  ProjectSummary,
  TaskStats
} from '@/features/dashboard/types'
import { getMember } from '@/features/members'
import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/middleware'
import { Members, Projects, Status, Tasks } from '@/types/appwrite'
import { Hono } from 'hono'
import { AppwriteException, Query } from 'node-appwrite'

// TYPES
type TaskStatsResponse =
  | { success: true; data: TaskStats }
  | { success: false; data: string }

type ProjectSummariesResponse =
  | { success: true; data: ProjectSummary[] }
  | { success: false; data: string }

type MemberSummariesResponse =
  | { success: true; data: MemberSummary[] }
  | { success: false; data: string }

// ROUTES
const app = new Hono()
  // GET TASK STATS ONLY
  .get('/:workspaceId/task-stats', sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param()
    const databases = c.get('tables')
    const user = c.get('user')

    try {
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member) {
        return c.json<TaskStatsResponse>(
          { success: false, data: 'You are not a member of this workspace' },
          403
        )
      }

      const tasks = await databases.listRows<Tasks>({
        databaseId: DATABASE_ID,
        tableId: TASKS_COLLECTION_ID,
        queries: [Query.equal('workspaceId', workspaceId)]
      })

      const completedTasks = tasks.rows.filter(
        (task) => task.status === Status.DONE
      ).length
      const totalTasks = tasks.total

      const taskStats: TaskStats = {
        completed: completedTasks,
        total: totalTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      }

      return c.json<TaskStatsResponse>({ success: true, data: taskStats })
    } catch (error: any) {
      console.error('Task stats API error:', error)
      const message =
        error instanceof AppwriteException
          ? error.message || 'An Appwrite error occurred'
          : error.message || 'Failed to fetch task statistics'
      return c.json<TaskStatsResponse>({ success: false, data: message }, 500)
    }
  })

  // GET PROJECT SUMMARIES ONLY
  .get('/:workspaceId/projects', sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param()
    const databases = c.get('tables')
    const user = c.get('user')

    try {
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member) {
        return c.json<ProjectSummariesResponse>(
          { success: false, data: 'You are not a member of this workspace' },
          403
        )
      }

      // Fetch tasks once to compute project completion
      const tasks = await databases.listRows<Tasks>({
        databaseId: DATABASE_ID,
        tableId: TASKS_COLLECTION_ID,
        queries: [Query.equal('workspaceId', workspaceId)]
      })

      const projects = await databases.listRows<Projects>({
        databaseId: DATABASE_ID,
        tableId: PROJECTS_COLLECTION_ID,
        queries: [
          Query.equal('workspaceId', workspaceId),
          Query.orderDesc('$createdAt')
        ]
      })

      const projectSummaries: ProjectSummary[] = projects.rows.map(
        (project) => {
          const projectTasks = tasks.rows.filter(
            (task) => task.projectId === project.$id
          )
          const projectCompletedTasks = projectTasks.filter(
            (task) => task.status === Status.DONE
          ).length
          const projectTaskCount = projectTasks.length

          return {
            id: project.$id,
            name: project.name,
            completionRate:
              projectTaskCount > 0
                ? (projectCompletedTasks / projectTaskCount) * 100
                : 0,
            status: 'active' as const,
            taskCount: projectTaskCount,
            completedTasks: projectCompletedTasks
          }
        }
      )

      return c.json<ProjectSummariesResponse>({
        success: true,
        data: projectSummaries
      })
    } catch (error: any) {
      console.error('Project summaries API error:', error)
      const message =
        error instanceof AppwriteException
          ? error.message || 'An Appwrite error occurred'
          : error.message || 'Failed to fetch project summaries'
      return c.json<ProjectSummariesResponse>(
        { success: false, data: message },
        500
      )
    }
  })

  // GET MEMBER SUMMARIES ONLY
  .get('/:workspaceId/members', sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param()
    const databases = c.get('tables')
    const user = c.get('user')
    const { users } = await createAdminClient()

    try {
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member) {
        return c.json<MemberSummariesResponse>(
          { success: false, data: 'You are not a member of this workspace' },
          403
        )
      }

      const members = await databases.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        queries: [Query.equal('workspaceId', workspaceId)]
      })

      const memberSummaries: MemberSummary[] = await Promise.all(
        members.rows.map(async (member) => {
          try {
            const userInfo = await users.get({
              userId: member.userId as string
            })

            return {
              id: member.$id,
              name: userInfo.name,
              email: userInfo.email,
              role: member.role.toLowerCase() as 'admin' | 'member',
              avatar: undefined,
              lastActive: undefined
            }
          } catch (error) {
            console.error('Error fetching user info:', error)
            return {
              id: member.$id,
              name: 'Unknown User',
              email: '',
              role: member.role.toLowerCase() as 'admin' | 'member',
              avatar: undefined,
              lastActive: undefined
            }
          }
        })
      )

      return c.json<MemberSummariesResponse>({
        success: true,
        data: memberSummaries
      })
    } catch (error: any) {
      console.error('Member summaries API error:', error)
      const message =
        error instanceof AppwriteException
          ? error.message || 'An Appwrite error occurred'
          : error.message || 'Failed to fetch member summaries'
      return c.json<MemberSummariesResponse>(
        { success: false, data: message },
        500
      )
    }
  })

export default app
