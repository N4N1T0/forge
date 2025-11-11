'use client'

import dynamic from 'next/dynamic'
import { DashboardCardSkeleton } from './dashboard-card-skeleton'

// CODE SPLITTING
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
  return (
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
        <div className='md:col-span-1'>
          <TaskCompletionCard workspaceId={workspaceId} />
        </div>

        <div className='md:col-span-1'>
          <ProjectListCard workspaceId={workspaceId} />
        </div>

        <div className='md:col-span-1'>
          <MemberListCard workspaceId={workspaceId} />
        </div>
      </main>
    </div>
  )
}
