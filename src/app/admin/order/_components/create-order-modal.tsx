'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { type orderCreateInput } from '@/server/api/types';
import { api } from '@/trpc/react';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type z } from 'zod';
import { CreateOrderForm } from './create-order-form';

type Order = z.infer<typeof orderCreateInput>;
export function CreateOrderModal() {
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const { mutate: createOrder } = api.order.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Захиалга амжилттай үүсгэгдлээ',
        description: 'Таны захиалга амжилттай үүсгэгдлээ.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Алдаа',
        description: error.message,
        variant: 'destructive'
      });
    },
    onSettled: () => {
      setIsNewOrderDialogOpen(false);
      router.refresh();
    }
  });

  const onSubmit = (data: Order) => {
    createOrder(data);
  };

  return (
    <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Захиалга үүсгэх
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[675px]">
        <DialogHeader>
          <DialogTitle> Шинэ захиалга үүсгэх</DialogTitle>
          <DialogDescription>
            Шинэ захиалга үүсгэхийн тулд шаардлагатай мэдээллийг бөглөнө үү.
          </DialogDescription>
        </DialogHeader>
        <CreateOrderForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
