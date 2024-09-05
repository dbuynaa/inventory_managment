'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { type Customer } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import CustomerCreateModal from './customer-create-modal';
import { customerDeleteAction } from '@/lib/actions';
import { toast } from '@/components/ui/use-toast';

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'id',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <CustomerCreateModal
            initialData={{
              id: row.original.id,
              name: row.original.name,
              email: row.original.email ?? '',
              phone: row.original.phone,
              address: row.original.address
            }}
          >
            <Button variant="outline" size="icon">
              <Icons.edit className="h-4 w-4" />
            </Button>
          </CustomerCreateModal>
          <Button
            formAction={async () => {
              const deleted = await customerDeleteAction(row.original.id);
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
        </div>
      );
    }
  }
];
