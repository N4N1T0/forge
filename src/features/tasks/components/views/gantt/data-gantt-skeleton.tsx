'use client'

import { Skeleton } from '@/components/ui/skeleton'

export const DataGanttSkeleton = () => {
  // CONST
  const barWidths = ['20%', '35%', '50%', '30%', '60%', '40%', '45%', '25%']

  return (
    <section className='pt-4 size-full'>
      <div className='border rounded-md overflow-hidden'>
        <div className='flex'>
          {/* TIMELINE */}
          <div className='flex-1'>
            {/* TIMELINE HEADER COLUMNS */}
            <div
              className='sticky top-0 z-10 flex items-end justify-between gap-2.5 border-b bg-backdrop/90 p-2.5 backdrop-blur-sm'
              style={{ height: '60px' }}
            >
              <Skeleton className='h-4 w-20' />
              <div className='flex-1 flex items-center gap-1'>
                {[...Array(12)].map((_, k) => (
                  <div key={k} className='flex-1 flex items-end'>
                    <Skeleton className='h-3 w-full' />
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE ROWS */}
            <div className='p-2'>
              {[...Array(8)].map((_, r) => (
                <div
                  key={r}
                  className='relative mb-2'
                  style={{ height: '36px' }}
                >
                  <div className='absolute inset-0'>
                    <div className='flex h-full gap-[1px]'>
                      {[...Array(24)].map((_, c) => (
                        <div key={c} className='flex-1 bg-muted/30' />
                      ))}
                    </div>
                  </div>

                  {/* FEATURE BAR SKELETON */}
                  <Skeleton
                    className='absolute top-1/2 -translate-y-1/2 h-4 rounded-md shadow-sm'
                    style={{
                      width: barWidths[r % barWidths.length],
                      left: '10%'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
