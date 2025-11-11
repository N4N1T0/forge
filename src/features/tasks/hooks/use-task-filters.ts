import { Status } from '@/types/appwrite'
import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'

export const useTaskFilters = () => {
  // NUQS FILTERS
  const [filters, setFilters] = useQueryStates({
    status: parseAsStringEnum(Object.values(Status)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString
  })

  // CONST
  const isAnyFilterActive = Object.values(filters).some(Boolean)

  // HANDLERS
  const resetFilters = () => {
    setFilters({
      status: null,
      assigneeId: null,
      search: null,
      dueDate: null
    })
  }

  return {
    ...filters,
    setFilters,
    isAnyFilterActive,
    resetFilters
  }
}
