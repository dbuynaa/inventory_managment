'use client';

import { Icons } from '@/components/icons';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Product } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type ProductShape = Pick<
  Product,
  'id' | 'name' | 'price' | 'costPrice' | 'quantityOnStock' | 'createdAt'
>;

export const columns = (
  handleEditClick: ({ product }: { product: Product }) => void,
  handleDeleteClick: ({ id }: { id: string }) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'costPrice',
    header: 'Cost Price'
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
    header: () => {
      return <div className="pl-4">Actions</div>;
    },
    maxSize: 40,
    cell: ({ row }) => {
      return (
        <>
          <Link
            key={row.original.id}
            href={`/admin/inventory/${row.original.id}`}
            className={cn(buttonVariants({ variant: 'ghost' }))}
          >
            <Icons.details className="h-5 w-5" />
          </Link>
          <Button
            onClick={() => handleEditClick({ product: row.original })}
            variant="ghost"
            size={'sm'}
          >
            <Icons.adjust className="h-5 w-5" />
          </Button>
          <Button
            // formAction={async () => {
            //   deleteProduct
            // }}
            onClick={() => handleDeleteClick({ id: row.original.id })}
            variant="ghost"
            size={'sm'}
          >
            <Icons.delete className="h-5 w-5" />
          </Button>
        </>
      );
    }
  }
];
