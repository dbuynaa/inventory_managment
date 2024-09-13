'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useSearch } from '@/hooks/useSearch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  limit: number;
  total: number;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page = 1,
  limit = 5,
  isLoading = false,
  total
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    onSortingChange: setSorting,

    state: {
      sorting
    }
  });
  const onSearch = useSearch();

  function prevPage() {
    if (page > 1) {
      onSearch('page', `${page - 1}`);
    }
  }
  function nextPage() {
    const maxPage = Math.ceil(total / limit);
    if (page < maxPage) {
      onSearch('page', `${page + 1}`);
    }
  }
  function handleLimitChange(newLimit: string) {
    onSearch('limit', newLimit);
  }
  return (
    <Card className="rounded-md border">
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-fit space-y-4 text-center"
                >
                  <Skeleton className="h-8 w-4/5" />
                  <Skeleton className="h-8 w-3/5" />
                  <Skeleton className="h-8 w-2/5" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="outline" onClick={prevPage} disabled={page <= 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={handleLimitChange}
            value={`${limit}`}
            defaultValue={`${limit}`}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={nextPage}
            disabled={page >= Math.ceil(total / limit)}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
