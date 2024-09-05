'use client';

import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type PurchaseOrder, type Supplier } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

type PurchaseOrderShape = PurchaseOrder & {
  supplier: Supplier;
};

export const columns: ColumnDef<PurchaseOrderShape>[] = [
  {
    accessorKey: 'supplier.name',
    header: 'Supplier'
  },
  {
    accessorKey: 'orderDate',
    header: 'Order Date',
    cell: ({ getValue }) => {
      return new Date(getValue<Date>()).toLocaleDateString();
    }
  },
  {
    accessorKey: 'expectedDeliveryDate',
    header: 'Delivery Date',
    cell: ({ getValue }) => {
      return new Date(getValue<Date>()).toLocaleDateString();
    }
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ getValue }) => {
      return `$${getValue<number>().toFixed(2)}`;
    }
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ getValue }) => {
      return (
        <Link
          href={`order?id=${getValue<string>()}`}
          prefetch={false}
          as={`order?id=${getValue<string>()}`}
          replace
          shallow
          className={cn(buttonVariants({ variant: 'ghost' }))}
        >
          <Icons.details className="h-5 w-5" />
        </Link>
      );
    }
  }
];
