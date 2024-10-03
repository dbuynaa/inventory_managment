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
  // {
  //   accessorKey: 'status',
  //   header: 'Төлөв',
  //   cell: ({ row, getValue }) => {
  //     return (
  //       <Select
  //         value={getValue<OrderStatus>()}
  //         onValueChange={async (value) => {
  //           const updated = await orderStatusAction(
  //             row.original.id,
  //             value as OrderStatus
  //           );
  //           toast({
  //             title: updated?.success ? 'Амжилттай' : 'Алдаа',
  //             description: updated?.message
  //           });
  //         }}
  //       >
  //         <SelectTrigger >
  //           <SelectValue />
  //         </SelectTrigger>
  //         <SelectContent>
  //           {Object.values(OrderStatus).map((status) => (
  //             <SelectItem key={status} value={status}>
  //               {status}
  //             </SelectItem>
  //           ))}
  //         </SelectContent>
  //       </Select>
  //     );
  //   }
  // },

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
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`order/${getValue<string>()}/edit`}
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
          >
            <Icons.edit className="h-4 w-4" />
          </Link>
          <Link
            href={`order/${getValue<string>()}`}
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
          >
            <Icons.details className="h-4 w-4" />
          </Link>
        </div>
      );
    }
  }
];
