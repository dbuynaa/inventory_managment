'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { type Product } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type ProductShape = Pick<
  Product,
  'id' | 'name' | 'price' | 'quantityOnStock' | 'createdAt'
>;

export const columns: ColumnDef<ProductShape>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'quantityOnStock',
    header: 'Quantity'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    accessorFn: (row) => new Date(row.createdAt).toLocaleDateString()
  },
  {
    accessorKey: 'id',
    header: 'Actions',
    maxSize: 40,
    cell: ({ row }) => {
      return (
        <Link
          key={row.original.id}
          href={`/admin/inventory/${row.original.id}`}
        >
          <Button variant="ghost" size={'sm'}>
            <Icons.edit className="h-4 w-4" />
          </Button>
        </Link>
      );
    }
  }
];
