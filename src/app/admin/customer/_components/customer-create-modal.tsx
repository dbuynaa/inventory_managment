'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CustomerForm from './customer-form';
import { useState } from 'react';
import { type z } from 'zod';
import { type customerCreateInput } from '@/server/api/types';
import { toast } from '@/components/ui/use-toast';
import { customerCreateAction, customerUpdateAction } from '@/lib/actions';

type Customer = z.infer<typeof customerCreateInput>;

export default function CustomerCreateModal({
  initialData,
  children
}: {
  children: React.ReactNode;
  initialData?: Customer;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleSubmitCustomer = async (customer: Omit<Customer, 'id'>) => {
    if (initialData?.id) {
      const updatedData = await customerUpdateAction({
        ...customer,
        id: initialData.id
      });

      if (updatedData.success)
        toast({
          title: 'Customer Updated',
          description: updatedData.message
        });

      if (!updatedData.success)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: updatedData.message
        });
    } else {
      const createdData = await customerCreateAction(customer);
      if (createdData.success)
        toast({
          title: 'Customer Added',
          description: createdData.message
        });

      if (!createdData.success)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: createdData.message
        });
    }
    setIsAddDialogOpen(false);
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <CustomerForm
          initialData={initialData}
          onSubmit={handleSubmitCustomer}
        />
      </DialogContent>
    </Dialog>
  );
}
