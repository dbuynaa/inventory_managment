'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { deleteSupplier } from '@/lib/actions';
import { type Supplier } from '@prisma/client';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// type Shape = Pick<
//   Supplier,
//   'id' | 'name' | 'email' | 'phoneNumber' | 'createdAt'
// >;

export const columns = (
  handleEditClick: ({ supplier }: { supplier: Supplier }) => void
): ColumnDef<Supplier>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </div>
      );
    },
    accessorFn: (row) => row.name
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone'
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created At
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </div>
    ),
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },

  {
    accessorKey: 'id',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => deleteSupplier(row.original.id)}
            key={row.original.id}
            size={'sm'}
            variant="ghost"
          >
            <Icons.delete className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleEditClick({ supplier: row.original })}
            key={row.original.id + '-edit'}
            variant="ghost"
            size={'sm'}
          >
            <Icons.edit className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  }
];
