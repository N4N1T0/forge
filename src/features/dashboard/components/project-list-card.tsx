'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Folder } from 'lucide-react'
import Link from 'next/link'
import { useGetProjectSummaries } from '../api/use-get-project-summaries'
import { DashboardCardError } from './dashboard-card-error'
import { DashboardCardSkeleton } from './dashboard-card-skeleton'

interface ProjectListCardProps {
  workspaceId: string
}

export function ProjectListCard({ workspaceId }: ProjectListCardProps) {
  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch
  } = useGetProjectSummaries({ workspaceId })

  // LOADING
  if (isLoading) {
    return <DashboardCardSkeleton />
  }

  // ERROR
  if (isError) {
    return (
      <DashboardCardError
        title='Failed to load projects'
        description={error?.message || 'Unable to fetch project data'}
        onRetry={() => refetch()}
      />
    )
  }

  // EMPTY
  if (!projects || projects.length === 0) {
    return (
      <Card role='region' aria-labelledby='projects-title'>
        <CardHeader>
          <CardTitle id='projects-title' className='text-base font-semibold'>
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Folder
              className='h-12 w-12 text-muted-foreground/50 mb-3'
              aria-hidden='true'
            />
            <p className='text-sm text-muted-foreground'>
              No projects yet. Create your first project to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card role='region' aria-labelledby='projects-title'>
      <CardHeader>
        <CardTitle id='projects-title' className='text-base font-semibold'>
          Projects ({projects.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav aria-label='Project list'>
          <ul className='space-y-4'>
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/dashboard/workspace/${workspaceId}/projects/${project.id}`}
                  className='block group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg'
                  aria-label={`${project.name} project, ${project.completionRate.toFixed(0)}% complete, ${project.status} status`}
                >
                  <div className='rounded-lg border p-4 transition-colors hover:bg-accent'>
                    {/* PROJECT HEADER */}
                    <div className='flex items-start justify-between gap-2 mb-3'>
                      <div className='flex items-center gap-2 min-w-0 flex-1'>
                        <Folder
                          className='h-4 w-4 text-muted-foreground flex-shrink-0'
                          aria-hidden='true'
                        />
                        <h3 className='font-medium text-sm truncate group-hover:text-primary transition-colors'>
                          {project.name}
                        </h3>
                      </div>
                      <Badge
                        variant={
                          project.status === 'completed'
                            ? 'default'
                            : project.status === 'on-hold'
                              ? 'secondary'
                              : 'outline'
                        }
                        className='flex-shrink-0'
                        aria-label={`Status: ${project.status}`}
                      >
                        {project.status === 'active' && 'Active'}
                        {project.status === 'completed' && 'Completed'}
                        {project.status === 'on-hold' && 'On Hold'}
                      </Badge>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className='space-y-2'>
                      <Progress
                        value={project.completionRate}
                        className='h-2'
                        aria-label={`Project progress: ${project.completionRate.toFixed(0)}%`}
                      />
                      <div className='flex items-center justify-between text-xs text-muted-foreground'>
                        <span
                          aria-label={`${project.completedTasks} of ${project.taskCount} tasks completed`}
                        >
                          {project.completedTasks} of {project.taskCount} tasks
                        </span>
                        <span className='font-medium' aria-hidden='true'>
                          {project.completionRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  )
}
