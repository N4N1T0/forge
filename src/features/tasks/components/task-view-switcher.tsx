import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const TaskViewSwitcher = () => {
  return (
    <Tabs className='flex-1 w-full border'>
      <div className='h-full flex flex-col overflow-auto py-2 px-4'>
        <div className='flex flex-col gap-y-2 lg:flex-row justify-between'></div>
        <TabsList className='w-full lg:w-auto bg-transparent border-b h-12'>
          <TabsTrigger value='table' className='w-full lg:w-auto'>
            Table
          </TabsTrigger>
          <TabsTrigger value='kanban' className='w-full lg:w-auto'>
            Kanban
          </TabsTrigger>
          <TabsTrigger value='calendar' className='w-full lg:w-auto'>
            Calendar
          </TabsTrigger>
          <TabsTrigger value='gantt' className='w-full lg:w-auto'>
            Gantt
          </TabsTrigger>
        </TabsList>

        {/* FILTERS */}

        <TabsContent value='table' className='mt-0'>
          Data Table
        </TabsContent>
        <TabsContent value='kanban' className='mt-0'>
          Kanban
        </TabsContent>
        <TabsContent value='calendar' className='mt-0'>
          Calendar
        </TabsContent>
        <TabsContent value='gantt' className='mt-0'>
          Gantt
        </TabsContent>
      </div>
    </Tabs>
  )
}
