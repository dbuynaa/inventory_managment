'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { adjustmentCreateInput } from '@/server/api/types';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdjustmentType, type Product } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

type AdjustmentFormData = z.infer<typeof adjustmentCreateInput>;

export default function InventoryAdjustForm({
  product,
  open,
  onOpenChange
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate, isPending } = api.product.productAdjustment.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
    onSettled: async () => {
      await api.useUtils().product.invalidate();
    }
  });
  //   const [execute, state, isPending] = useActionState(
  //     adjustmentCreateAction,
  //     null
  //   );
  const form = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentCreateInput),
    defaultValues: {
      productId: product.id,
      adjustmentType: 'ADDED',
      quantityAdjusted: 0,
      reason: ''
    }
  });

  //   useEffect(() => {
  //     if (state ==) {
  //       onOpenChange(false);
  //       form.reset();
  //     }
  //   }, [form, onOpenChange, state?.success]);

  function onSubmit(data: AdjustmentFormData) {
    mutate({
      ...data,
      productId: product.id
    });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Adjust</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Inventory for {product.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="quantityAdjusted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
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
                  <FormLabel>Adjustment Type</FormLabel>
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
                          placeholder="Adjustment Type"
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
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter reason for adjustment"
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
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
