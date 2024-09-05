'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { salesDeleteAction } from '@/lib/actions';
import { type SalesDetail, type Customer, type Sale } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import SalesCreateModal from './sales-create-modal';

type SalesShape = Sale & {
  customer: Customer;
  salesDetails: SalesDetail[];
};
export const salesColumns: ColumnDef<SalesShape>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    accessorFn: (row) => row.id.slice(0, 6)
  },
  {
    accessorKey: 'saleDate',
    header: 'Order Date',
    cell: ({ getValue }) => {
      return new Date(getValue<Date>()).toLocaleDateString();
    }
  },
  {
    accessorKey: 'customer.name',
    header: 'Customer',
    cell: ({ getValue }) => {
      return new Date(getValue<Date>()).toLocaleDateString();
    }
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ getValue }) => {
      return `$${getValue<number>().toFixed(2)}`;
    }
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'id',
    header: 'Actions',
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
                title: deleted?.success ? 'Success' : 'Error',
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
