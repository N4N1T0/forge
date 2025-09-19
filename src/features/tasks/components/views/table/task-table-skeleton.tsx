import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export function TaskTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className='h-5 w-[100px]' />
          </TableHead>
          <TableHead>
            <Skeleton className='h-5 w-[100px]' />
          </TableHead>
          <TableHead>
            <Skeleton className='h-5 w-[100px]' />
          </TableHead>
          <TableHead>
            <Skeleton className='h-5 w-[100px]' />
          </TableHead>
          <TableHead>
            <Skeleton className='h-5 w-[100px]' />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 })
          .fill('table-skeleton')
          .map((row, index) => (
            <TableRow key={`${row}-${index}`}>
              <TableCell>
                <Skeleton className='h-6 w-full' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-full' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-full' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-full' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-full' />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
