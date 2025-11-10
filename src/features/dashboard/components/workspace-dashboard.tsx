'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { performanceMonitor } from '../lib/performance'
import { DashboardCardSkeleton } from './dashboard-card-skeleton'
import { DashboardErrorBoundary } from './dashboard-error-boundary'

// CODE SPLITTING: Lazy load dashboard cards for better performance
const TaskCompletionCard = dynamic(
  () =>
    import('./task-completion-card').then((mod) => ({
      default: mod.TaskCompletionCard
    })),
  {
    loading: () => <DashboardCardSkeleton />,
    ssr: true
  }
)

const ProjectListCard = dynamic(
  () =>
    import('./project-list-card').then((mod) => ({
      default: mod.ProjectListCard
    })),
  {
    loading: () => <DashboardCardSkeleton />,
    ssr: true
  }
)

const MemberListCard = dynamic(
  () =>
    import('./member-list-card').then((mod) => ({
      default: mod.MemberListCard
    })),
  {
    loading: () => <DashboardCardSkeleton />,
    ssr: true
  }
)

interface WorkspaceDashboardProps {
  workspaceId: string
}

export function WorkspaceDashboard({ workspaceId }: WorkspaceDashboardProps) {
  // PERFORMANCE MONITORING
  useEffect(() => {
    performanceMonitor.start('dashboard-load')
    performanceMonitor.getWebVitals()

    return () => {
      performanceMonitor.end('dashboard-load')
    }
  }, [])

  return (
    <DashboardErrorBoundary>
      <div className='space-y-6'>
        {/* DASHBOARD HEADER */}
        <header>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Overview of your workspace activity and metrics
          </p>
        </header>

        {/* RESPONSIVE DASHBOARD GRID */}
        <main
          className='grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          role='main'
          aria-label='Dashboard cards'
        >
          {/* TASK COMPLETION CARD - Full width on mobile, spans 1 column on larger screens */}
          <div className='md:col-span-1'>
            <DashboardErrorBoundary>
              <TaskCompletionCard workspaceId={workspaceId} />
            </DashboardErrorBoundary>
          </div>

          {/* PROJECT LIST CARD - Full width on mobile, spans 1 column on larger screens */}
          <div className='md:col-span-1'>
            <DashboardErrorBoundary>
              <ProjectListCard workspaceId={workspaceId} />
            </DashboardErrorBoundary>
          </div>

          {/* MEMBER LIST CARD - Full width on mobile, spans 1 column on larger screens */}
          <div className='md:col-span-1'>
            <DashboardErrorBoundary>
              <MemberListCard workspaceId={workspaceId} />
            </DashboardErrorBoundary>
          </div>
        </main>
      </div>
    </DashboardErrorBoundary>
  )
}
