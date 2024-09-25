'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { salesDeleteAction, salesStatusAction } from '@/lib/actions';
import {
  type SalesDetail,
  type Customer,
  type Sale,
  SalesStatus
} from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import SalesCreateModal from './sales-create-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type SalesShape = Sale & {
  customer: Customer;
  salesDetails: SalesDetail[];
};
export const salesColumns: ColumnDef<SalesShape>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.original.id.slice(0, 6)
  },
  {
    accessorKey: 'saleDate',
    header: 'Захиалгын огноо',
    cell: ({ getValue }) => {
      return new Date(getValue<Date>()).toLocaleDateString(); // Огноог форматаар харуулах
    }
  },
  {
    accessorKey: 'customer.name',
    header: 'Харилцагч'
  },
  {
    accessorKey: 'totalAmount',
    header: 'Нийт дүн',
    cell: ({ getValue }) => {
      return `$${getValue<number>().toFixed(2)}`; // Дүнг мөнгөн тэмдэгтээр харуулах
    }
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Төлбөрийн арга'
  },
  {
    accessorKey: 'status',
    header: 'Байдал',
    cell: ({ row }) => {
      return (
        <Select
          value={row.original.status}
          onValueChange={async (value) => {
            const updated = await salesStatusAction(
              row.original.id,
              value as SalesStatus
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
            <SelectItem value={SalesStatus.PENDING}>Хүлээгдэж буи</SelectItem>
            <SelectItem value={SalesStatus.PROCESSING}>
              Хүргэгдэж буи
            </SelectItem>
            <SelectItem value={SalesStatus.SHIPPED}>Хүргэсэн</SelectItem>
          </SelectContent>
        </Select>
      );
    }
  },
  {
    accessorKey: 'id',
    header: 'Үйлдлүүд',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Icons.details className="h-4 w-4" />
          </Button>
          <SalesCreateModal
          // initialData={{
          //   id: row.original.id,
          //   customerId: row.original.customerId,
          //   paymentMethod: row.original.paymentMethod,
          //   products: row.original.products
          // }}
          >
            <Button variant="outline" size="icon">
              <Icons.edit className="h-4 w-4" />
            </Button>
          </SalesCreateModal>
          <Button
            formAction={async () => {
              const deleted = await salesDeleteAction(row.original.id);
              toast({
                title: deleted?.success ? 'Амжилттай' : 'Алдаа',
                description: deleted?.message
              });
            }}
            variant="outline"
            size="icon"
          >
            <Icons.delete className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  }
];
