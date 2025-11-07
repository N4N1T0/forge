'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { AlertCircle, SearchIcon, XIcon } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'

interface TaskSearchProps {
  placeholder?: string
  className?: string
  onSearchError?: (error: string | null) => void
  isSearching?: boolean
}

export const TaskSearchComponent = ({
  placeholder = 'Search tasks...',
  className,
  onSearchError,
  isSearching = false
}: TaskSearchProps) => {
  // HOOKS
  const [search, setSearch] = useQueryState('search', {
    ...parseAsString,
    defaultValue: '',
    clearOnDefault: true
  })

  // STATE
  const [localSearch, setLocalSearch] = useState(search || '')
  const [searchError, setSearchError] = useState<string | null>(null)

  // SP - DEBOUNCE
  const debouncedSearch = useDebounce(localSearch, 300)

  useEffect(() => {
    const updateSearch = async () => {
      try {
        setSearchError(null)
        await setSearch(debouncedSearch || null)
        onSearchError?.(null)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Search failed'
        setSearchError(errorMessage)
        onSearchError?.(errorMessage)
      }
    }

    updateSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, setSearch])

  useEffect(() => {
    setLocalSearch(search || '')
  }, [search])

  // HANDLERS
  const handleClear = () => {
    setLocalSearch('')
    setSearch(null)
    setSearchError(null)
    onSearchError?.(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setLocalSearch(value)

    if (searchError) {
      setSearchError(null)
      onSearchError?.(null)
    }
  }

  // CONST
  const hasValue = localSearch.length > 0
  const hasError = !!searchError

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
            className={cn(
              'pl-9 pr-9',
              hasError && 'border-destructive focus-visible:ring-destructive'
            )}
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

      {/* ERROR MESSAGE */}
      {hasError && (
        <div className='flex items-center gap-2 text-sm text-destructive'>
          <AlertCircle className='h-4 w-4' />
          <span>{searchError}</span>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setSearchError(null)
              onSearchError?.(null)
            }}
            className='ml-auto h-6 px-2 text-xs'
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  )
}
