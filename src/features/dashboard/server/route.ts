/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  TASKS_COLLECTION_ID
} from '@/config'
import { getMember } from '@/features/members/utils'
import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/middleware'
import { Members, Projects, Status, Tasks } from '@/types/appwrite'
import { Hono } from 'hono'
import { AppwriteException, Query } from 'node-appwrite'
import { DashboardData } from '../types'

// TYPES
type DashboardResponse =
  | {
      success: true
      data: DashboardData
    }
  | {
      success: false
      data: string
    }

// ROUTES
const app = new Hono().get(
  '/:workspaceId/dashboard',
  sessionMiddleware,
  async (c) => {
    const { workspaceId } = c.req.param()
    const databases = c.get('tables')
    const user = c.get('user')
    const { users } = await createAdminClient()

    try {
      // Verify user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member) {
        return c.json<DashboardResponse>(
          {
            success: false,
            data: 'You are not a member of this workspace'
          },
          403
        )
      }

      // Fetch all tasks for the workspace
      const tasks = await databases.listRows<Tasks>({
        databaseId: DATABASE_ID,
        tableId: TASKS_COLLECTION_ID,
        queries: [Query.equal('workspaceId', workspaceId)]
      })

      // Calculate task statistics
      const completedTasks = tasks.rows.filter(
        (task) => task.status === Status.DONE
      ).length
      const totalTasks = tasks.total

      const taskStats = {
        completed: completedTasks,
        total: totalTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      }

      // Fetch all projects for the workspace
      const projects = await databases.listRows<Projects>({
        databaseId: DATABASE_ID,
        tableId: PROJECTS_COLLECTION_ID,
        queries: [
          Query.equal('workspaceId', workspaceId),
          Query.orderDesc('$createdAt')
        ]
      })

      // Calculate project summaries with completion rates
      const projectSummaries = projects.rows.map((project) => {
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
      })

      // Fetch all members for the workspace
      const members = await databases.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        queries: [Query.equal('workspaceId', workspaceId)]
      })

      // Populate member data with user information
      const memberSummaries = await Promise.all(
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

      // Calculate quick stats
      const quickStats = {
        totalProjects: projects.total,
        totalTasks: tasks.total,
        totalMembers: members.total,
        recentActivity: 0 // TODO: Implement activity tracking
      }

      const dashboardData: DashboardData = {
        taskStats,
        projects: projectSummaries,
        members: memberSummaries,
        quickStats
      }

      return c.json<DashboardResponse>({
        success: true,
        data: dashboardData
      })
    } catch (error: any) {
      console.error('Dashboard API error:', error)

      if (error instanceof AppwriteException) {
        return c.json<DashboardResponse>(
          {
            success: false,
            data: error.message || 'An Appwrite error occurred'
          },
          500
        )
      }

      return c.json<DashboardResponse>(
        {
          success: false,
          data: error.message || 'Failed to fetch dashboard data'
        },
        500
      )
    }
  }
)

export default app
