'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { deleteSupplier } from '@/lib/actions';
import { type Supplier } from '@prisma/client';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Shape = Pick<
  Supplier,
  'id' | 'name' | 'email' | 'phoneNumber' | 'createdAt'
>;

export const columns: ColumnDef<Shape>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.name
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <CaretSortIcon
            className={`ml-2 h-4 w-4 ${column.getIsSorted() === 'asc' ? 'text-foreground' : ''}`}
          />
        </Button>
      );
    },
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => row.original.createdAt.toLocaleDateString()
  },

  {
    accessorKey: 'id',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <Button
          onClick={() => deleteSupplier(row.original.id)}
          key={row.original.id}
          id={row.original.id}
          size={'sm'}
          variant="ghost"
        >
          <Icons.delete className="h-4 w-4" />
        </Button>
      );
    }
  }
];
