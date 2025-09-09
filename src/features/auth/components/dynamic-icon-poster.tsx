import { DynamicIcon, IconName } from 'lucide-react/dynamic'

interface DynamicIconPosterProps {
  icon?: IconName
}

export const DynamicIconPoster = ({
  icon = 'anvil'
}: DynamicIconPosterProps) => {
  return (
    <div className='hidden lg:flex lg:w-1/2 bg-muted items-center justify-center'>
      <DynamicIcon
        name={icon || 'anvil'}
        className='text-primary w-1/2 h-1/2'
        strokeWidth={0.1}
      />
    </div>
  )
}
