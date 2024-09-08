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
    header: 'Нийлүүлэгч'
  },
  {
    accessorKey: 'orderDate',
    header: 'Захиалгын Огноо',
    cell: ({ getValue }) => {
      return new Date(getValue<Date>()).toLocaleDateString();
    }
  },
  {
    accessorKey: 'expectedDeliveryDate',
    header: 'Хүргэх Огноо',
    cell: ({ getValue }) => {
      return new Date(getValue<Date>()).toLocaleDateString();
    }
  },
  {
    accessorKey: 'status',
    header: 'Төлөв'
  },
  {
    accessorKey: 'totalAmount',
    header: 'Нийт Дүн',
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
