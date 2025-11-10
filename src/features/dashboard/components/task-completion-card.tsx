'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { CheckCircle2, Circle } from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'
import { useGetTaskStats } from '../api/use-get-task-stats'
import { DashboardCardError } from './dashboard-card-error'
import { DashboardCardSkeleton } from './dashboard-card-skeleton'

interface TaskCompletionCardProps {
  workspaceId: string
}

// CHART CONFIG - Static configuration
const chartConfig = {
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-1))'
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))'
  }
}

export function TaskCompletionCard({ workspaceId }: TaskCompletionCardProps) {
  const {
    data: taskStats,
    isLoading,
    isError,
    error,
    refetch
  } = useGetTaskStats({ workspaceId })

  // LOADING
  if (isLoading) {
    return <DashboardCardSkeleton />
  }

  // ERROR
  if (isError) {
    return (
      <DashboardCardError
        title='Failed to load task statistics'
        description={error?.message || 'Unable to fetch task completion data'}
        onRetry={() => refetch()}
      />
    )
  }

  // EMPTY
  if (!taskStats) {
    return (
      <DashboardCardError
        title='No task data available'
        description='Task statistics are not available for this workspace'
      />
    )
  }

  const { completed, total, completionRate } = taskStats
  const pending = total - completed

  // CHART DATA
  const chartData = [
    {
      name: 'Completed',
      value: completed,
      fill: 'hsl(var(--chart-1))'
    },
    {
      name: 'Pending',
      value: pending,
      fill: 'hsl(var(--chart-2))'
    }
  ]

  return (
    <Card role='region' aria-labelledby='task-completion-title'>
      <CardHeader>
        <CardTitle
          id='task-completion-title'
          className='text-base font-semibold'
        >
          Task Completion
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* CHART VISUALIZATION */}
        <div
          className='flex items-center justify-center'
          role='img'
          aria-label={`Task completion chart showing ${completionRate.toFixed(1)}% completion rate. ${completed} tasks completed out of ${total} total tasks.`}
        >
          <ChartContainer config={chartConfig} className='h-[200px] w-full'>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={80}
                strokeWidth={2}
              >
                {chartData.map((entry: { fill: string }, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        {/* COMPLETION PERCENTAGE */}
        <div className='text-center' aria-live='polite'>
          <div
            className='text-3xl font-bold'
            aria-label={`${completionRate.toFixed(1)} percent completion rate`}
          >
            {completionRate.toFixed(1)}%
          </div>
          <p className='text-sm text-muted-foreground'>Completion Rate</p>
        </div>

        {/* COUNT */}
        <div className='space-y-2' role='list' aria-label='Task statistics'>
          <div
            className='flex items-center justify-between rounded-lg border p-3'
            role='listitem'
          >
            <div className='flex items-center gap-2'>
              <CheckCircle2
                className='h-4 w-4 text-chart-1'
                aria-hidden='true'
              />
              <span className='text-sm font-medium'>Completed</span>
            </div>
            <span
              className='text-sm font-bold'
              aria-label={`${completed} completed tasks`}
            >
              {completed}
            </span>
          </div>

          <div
            className='flex items-center justify-between rounded-lg border p-3'
            role='listitem'
          >
            <div className='flex items-center gap-2'>
              <Circle className='h-4 w-4 text-chart-2' aria-hidden='true' />
              <span className='text-sm font-medium'>Pending</span>
            </div>
            <span
              className='text-sm font-bold'
              aria-label={`${pending} pending tasks`}
            >
              {pending}
            </span>
          </div>
        </div>

        {/* TOTAL */}
        <div className='border-t pt-3 text-center'>
          <p className='text-sm text-muted-foreground'>
            Total Tasks:{' '}
            <span className='font-semibold' aria-label={`${total} total tasks`}>
              {total}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
