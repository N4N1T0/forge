import { Loader } from 'lucide-react'

function WorkspaceLoading() {
  return (
    <div className='size-full flex items-center justify-center'>
      <Loader className='animate-spin size-6 text-muted-foreground' />
    </div>
  )
}

export default WorkspaceLoading
