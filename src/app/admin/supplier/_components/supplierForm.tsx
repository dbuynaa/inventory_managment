'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { supplierCreateInput } from '@/server/api/types';
import { createOrUpdateSupplier } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

type SupplierFormData = z.infer<typeof supplierCreateInput>;

type SupplierFormProps = {
  initialData?: SupplierFormData;
  onSuccess?: () => void;
};

export default function SupplierForm({
  initialData,
  onSuccess
}: SupplierFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierCreateInput),
    defaultValues: initialData?.id
      ? initialData
      : {
          id: '',
          name: '',
          phoneNumber: '',
          email: ''
        }
  });
  async function onSubmit(data: SupplierFormData) {
    setLoading(true);
    const res = await createOrUpdateSupplier({
      ...data,
      id: initialData?.id
    });
    if (res.success) {
      setLoading(false);
      toast({
        title: res.message,
        description: 'Supplier saved successfully',
        variant: 'default'
      });
      onSuccess?.();
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter supplier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {state?.errors && <p className={'text-red-500'}>{state.message}</p>} */}
        <Button disabled={loading} type="submit">
          {initialData ? 'Update Supplier' : 'Add Supplier'}
        </Button>
      </form>
    </Form>
  );
}
