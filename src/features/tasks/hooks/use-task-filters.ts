import { Status } from '@/types/appwrite'
import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'

export const useTaskFilters = () => {
  return useQueryStates({
    status: parseAsStringEnum(Object.values(Status)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString
  })
}
