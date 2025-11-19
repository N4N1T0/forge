import { Workspaces } from '@/types/appwrite'
import { WorkspaceDangerZone } from './workspace-danger-zone'
import { EditWorkspacesForm } from './workspace-edit-form'

// TYPES
interface PageSettingsProps {
  initialValues: Workspaces
}

export const PageSettings = ({ initialValues }: PageSettingsProps) => {
  return (
    <div>
      <header className='border-b pb-4'>
        <h1 className='text-2xl font-bold tracking-tight'>
          Workspace Settings
        </h1>
        <p className='text-muted-foreground'>
          Manage your workspace details and configuration
        </p>
      </header>
      <div className='pt-3 size-full grid grid-cols-1 md:grid-cols-5 gap-4'>
        <EditWorkspacesForm initialValues={initialValues} />
        <WorkspaceDangerZone initialValues={initialValues} />
      </div>
    </div>
  )
}
