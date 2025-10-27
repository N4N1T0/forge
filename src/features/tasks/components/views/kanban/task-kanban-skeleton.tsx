import {
  KanbanBoard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider
} from '@/components/ui/kanban'
import { Skeleton } from '@/components/ui/skeleton'
import { status } from '@/data'

// CONSTANTS
const boards = status.map(({ label, value, color }) => ({
  id: value,
  name: label,
  color
}))

export function TaskKanbanSkeleton() {
  return (
    <section className='pt-4 size-full'>
      <KanbanProvider columns={boards} data={[]}>
        {({ color, id, name }) => (
          <KanbanBoard id={id} key={id}>
            <KanbanHeader>
              <div className='flex items-center gap-2'>
                <div
                  className='size-2 rounded-full'
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
              </div>
            </KanbanHeader>
            <KanbanCards id={id}>{() => null}</KanbanCards>
            <div className='flex flex-col gap-2 p-2'>
              {Array.from({ length: 5 })
                .fill('kanban-skeleton')
                .map((_, index) => (
                  <div
                    key={`${id}-skeleton-${index}`}
                    className='cursor-grab gap-4 rounded-md p-3 shadow-sm bg-card border'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex flex-col gap-1 flex-1'>
                        <Skeleton className='h-4 w-full' />
                      </div>
                      <Skeleton className='size-4 rounded-full shrink-0' />
                    </div>
                    <Skeleton className='h-3 w-full mt-2' />
                    <div className='flex items-center justify-between gap-2'>
                      <Skeleton className='h-3 w-3/4 mt-2' />
                      <Skeleton className='size-3 rounded-full shrink-0' />
                    </div>
                  </div>
                ))}
            </div>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </section>
  )
}
