'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { type z } from 'zod';
import { type salesCreateInput } from '@/server/api/types';
import { toast } from '@/components/ui/use-toast';
import { salesCreateAction, salesUpdateAction } from '@/lib/actions';
import SaleForm from './sales-form';

type Sales = z.infer<typeof salesCreateInput>;

export default function SalesCreateModal({
  initialData,
  children
}: {
  children: React.ReactNode;
  initialData?: Sales;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleSubmitSales = async (data: Omit<Sales, 'id'>) => {
    if (initialData?.id) {
      const updatedData = await salesUpdateAction({
        ...data,
        id: initialData.id
      });

      if (updatedData.success)
        toast({
          title: 'Sales Updated',
          description: updatedData.message
        });

      if (!updatedData.success)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: updatedData.message
        });
    } else {
      const createdData = await salesCreateAction(data);
      if (createdData.success)
        toast({
          title: 'Sales Added',
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
      <DialogContent className="sm:max-w-[625px]">
        <SaleForm initialData={initialData} onSubmit={handleSubmitSales} />
      </DialogContent>
    </Dialog>
  );
}
