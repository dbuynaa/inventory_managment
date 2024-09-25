'use client';

import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductStatus, type Product } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import InventoryAdjustForm from './inventory-adjust-form';
import { AlertModal } from '@/components/modal/alert-modal';
import { deleteProduct, productStatusAction } from '@/lib/actions';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
    accessorKey: 'status',
    header: 'Төлөв',
    cell: ({ row }) => {
      return (
        <Select
          value={row.original.status}
          onValueChange={async (value) => {
            const updated = await productStatusAction(
              row.original.id,
              value as ProductStatus
            );
            toast({
              title: updated?.success ? 'Амжилттай' : 'Алдаа',
              description: updated?.message
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ProductStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
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
