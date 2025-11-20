'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTaskFilters } from '@/features/tasks'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { SearchIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

// TYPES
interface TaskSearchProps {
  placeholder?: string
  className?: string
  isSearching?: boolean
}

export const TaskSearchComponent = ({
  placeholder = 'Search tasks...',
  className,
  isSearching = false
}: TaskSearchProps) => {
  // SEARCH STATE
  const { search, setFilters } = useTaskFilters()

  // STATE
  const [localSearch, setLocalSearch] = useState(search || '')

  // SP - DEBOUNCE
  const debouncedSearch = useDebounce(localSearch, 300)

  // EFFECT - SET FILTERS
  useEffect(() => {
    setFilters({ search: debouncedSearch || null })
  }, [debouncedSearch, setFilters])

  useEffect(() => {
    if (search === null) {
      setLocalSearch('')
    }
  }, [search])

  // HANDLERS
  const handleClear = () => {
    setLocalSearch('')
    setFilters({
      search: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)
  }

  // CONST
  const hasValue = localSearch.length > 0

  return (
    <div className={cn('relative flex flex-col gap-2', className)}>
      <div className='relative flex items-center'>
        <div className='relative flex-1'>
          <SearchIcon
            className={cn(
              'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
              isSearching
                ? 'animate-pulse text-primary'
                : 'text-muted-foreground'
            )}
          />
          <Input
            placeholder={placeholder}
            value={localSearch}
            onChange={handleInputChange}
            className='pl-9 pr-9'
            disabled={isSearching}
          />
          {hasValue && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClear}
              disabled={isSearching}
              className='absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted'
            >
              <XIcon className='h-4 w-4' />
              <span className='sr-only'>Clear search</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
