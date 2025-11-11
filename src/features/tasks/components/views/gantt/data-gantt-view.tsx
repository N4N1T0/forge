'use client'

import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu'
import {
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttTimeline,
  GanttToday
} from '@/components/ui/gantt'
import { status as statusData } from '@/data'
import {
  TaskEmptySearchView,
  TaskEmptyView
} from '@/features/tasks/components/views/empty'
import { TaskContextMenu } from '@/features/tasks/components/views/task-context-menu'
import { useTaskFilters } from '@/features/tasks/hooks'
import { useChangeTaskDueDate } from '@/features/tasks/server/patch/use-change-task-due-date'
import { cn } from '@/lib/utils'
import { DataViewProps } from '@/types'
import { useMemo } from 'react'
import { TaskViewError } from '../task-view-error'
import { DataGanttSkeleton } from './data-gantt-skeleton'

type DataGanttViewProps = DataViewProps

export const DataGanttView = ({
  data,
  isLoading,
  error,
  refetch
}: DataGanttViewProps) => {
  // DATA
  const features = useMemo(() => {
    return (
      data?.map((task) => {
        const meta = statusData.find((s) => s.value === task.status)
        return {
          id: task.$id,
          name: task.name,
          startAt: new Date(task.$createdAt),
          endAt: new Date(task.dueDate),
          status: {
            id: task.status,
            name: meta?.label ?? task.status,
            color: meta?.color ?? 'var(--border)'
          },
          lane: task.project?.name ?? 'Unassigned'
        }
      }) || []
    )
  }, [data])

  const groupedFeatures = useMemo(() => {
    return features.reduce(
      (acc, feature) => {
        const key = feature.lane ?? 'Unassigned'
        ;(acc[key] ??= []).push(feature)
        return acc
      },
      {} as Record<string, typeof features>
    )
  }, [features])

  const sortedGroupedFeatures = useMemo(() => {
    return Object.fromEntries(
      Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
        nameA.localeCompare(nameB)
      )
    )
  }, [groupedFeatures])

  // HOOKS
  const changeDueDate = useChangeTaskDueDate()
  const { isAnyFilterActive } = useTaskFilters()

  // HANDLERS
  const handleMoveFeature = (
    id: string,
    _startAt: Date,
    endAt: Date | null
  ) => {
    if (!endAt) return
    // Only update the dueDate (endAt)
    changeDueDate.mutate({
      param: { taskId: id },
      json: { dueDate: endAt.toISOString() }
    })
  }

  // RENDER
  if (isLoading) {
    return <DataGanttSkeleton />
  }

  if (error && !isLoading) {
    return <TaskViewError handleRetry={refetch} />
  }

  if ((!data || data.length === 0) && !isAnyFilterActive) {
    return <TaskEmptyView />
  }

  if ((!data || data.length === 0) && isAnyFilterActive) {
    return <TaskEmptySearchView />
  }
  return (
    <GanttProvider className='border mt-2' range='monthly' zoom={100}>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
            <GanttFeatureListGroup key={group}>
              {features.map((feature) => (
                <div className='flex' key={feature.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button type='button' className={cn('w-full text-left')}>
                        <GanttFeatureItem
                          onMove={handleMoveFeature}
                          {...feature}
                        />
                      </button>
                    </ContextMenuTrigger>
                    {data &&
                      (() => {
                        const originalTask = data.find(
                          (t) => t.$id === feature.id
                        )
                        return originalTask ? (
                          <TaskContextMenu task={originalTask} />
                        ) : null
                      })()}
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        <GanttToday />
      </GanttTimeline>
    </GanttProvider>
  )
}
