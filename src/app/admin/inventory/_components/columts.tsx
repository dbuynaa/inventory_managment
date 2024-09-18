'use client';

import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Product } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import InventoryAdjustForm from './inventory-adjust-form';
import { AlertModal } from '@/components/modal/alert-modal';
import { deleteProduct } from '@/lib/actions';
import { toast } from '@/components/ui/use-toast';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Нэр'
  },
  {
    accessorKey: 'price',
    header: 'Үнэ'
  },
  {
    accessorKey: 'costPrice',
    header: 'Өртгийн үнэ'
  },
  {
    accessorKey: 'quantityOnStock',
    header: 'Нөөц'
  },
  {
    accessorKey: 'createdAt',
    header: 'Үүсгэсэн огноо',
    accessorFn: (row) => new Date(row.createdAt).toLocaleDateString()
  },
  {
    accessorKey: 'id',
    header: () => {
      return <div className="pl-4">Үйлдлүүд</div>;
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
          <Button variant="ghost" size={'sm'}>
            <InventoryAdjustForm product={row.original}>
              <Icons.adjust className="h-5 w-5" />
            </InventoryAdjustForm>
            {/* <Icons.adjust className="h-5 w-5" /> */}
          </Button>
          <AlertModal
            onConfirm={async () => {
              const res = await deleteProduct(row.original.id);
              if (res.success) {
                toast({
                  title: 'Амжилттай',
                  description: res.message
                });
              } else {
                toast({
                  title: 'Алдаа гарлаа',
                  description: res.message
                });
              }
            }}
          >
            <Button variant="ghost" size={'sm'}>
              <Icons.delete className="h-5 w-5" />
            </Button>
          </AlertModal>
        </>
      );
    }
  }
];
