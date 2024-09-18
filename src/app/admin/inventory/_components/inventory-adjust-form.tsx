'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { adjustmentCreateAction } from '@/lib/actions';
import { adjustmentCreateInput } from '@/server/api/types';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdjustmentType, type Product } from '@prisma/client';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

type AdjustmentFormData = z.infer<typeof adjustmentCreateInput>;

export default function InventoryAdjustForm({
  product,
  children
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const [open, onOpenChange] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const form = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentCreateInput),
    defaultValues: {
      productId: product.id,
      adjustmentType: 'INCREASE',
      quantityAdjusted: 0,
      reason: ''
    }
  });

  async function onSubmit(data: AdjustmentFormData) {
    setIsPending(true);
    const { success, message } = await adjustmentCreateAction(data);
    if (success) {
      toast({
        title: 'Success',
        description: message
      });
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        title: 'Error',
        description: message
      });
    }
    setIsPending(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name} барааны тохиргоог хийх</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="quantityAdjusted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тоо ширхэг</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Тоо хэмжээг оруулна уу"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adjustmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тохируулгын төрөл</FormLabel>
                  <Select
                    // disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value || ''} // Ensure a default value is set
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value || ''}
                          placeholder="Тохируулгын төрөл"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(AdjustmentType).map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Шалтгаан</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Тохируулах шалтгааныг оруулна уу"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* {state?.errors && <p className={'text-red-500'}>{state.message}</p>} */}
            <Button disabled={isPending} type="submit">
              Хадгалах
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
