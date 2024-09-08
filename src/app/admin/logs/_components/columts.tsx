'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { type Product, type InventoryLog } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';

type InventoryLogShape = InventoryLog & {
  product: Product;
};

export const columns: ColumnDef<InventoryLogShape>[] = [
  {
    accessorKey: 'product',
    header: 'Бүтээгдэхүүн',
    accessorFn: (row) => row.product.name
  },
  {
    accessorKey: 'changedAt',
    header: 'Огноо',
    accessorFn: (row) => new Date(row.changedAt).toLocaleDateString()
  },
  {
    accessorKey: 'quantityChange',
    header: 'Өөрчлөлт',
    cell: ({ row }) => {
      return (
        <span
          className={
            row.original.quantityChange > 0 ? 'text-green-600' : 'text-red-600'
          }
        >
          {row.original.quantityChange > 0 ? '+' : ''}
          {row.original.quantityChange}
        </span>
      );
    }
  },
  {
    accessorKey: 'changeType',
    header: 'Төрөл'
  },
  {
    accessorKey: 'referenceId',
    header: 'Сэргийлэл'
  },
  {
    accessorKey: 'id',
    header: 'Үйлдлүүд',
    cell: () => {
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Icons.details className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Icons.edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Icons.delete className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  }
];
