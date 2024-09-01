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
import { useFormState } from 'react-dom';
import { createOrUpdateSupplier } from '@/lib/actions';
import { useEffect } from 'react';

type SupplierFormData = z.infer<typeof supplierCreateInput>;

type SupplierFormProps = {
  initialData?: SupplierFormData;
  onSuccess?: () => void;
};

export default function SupplierForm({
  initialData,
  onSuccess
}: SupplierFormProps) {
  const [state, formAction, isPending] = useFormState(
    createOrUpdateSupplier,
    null
  );
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
  useEffect(() => {
    if (state?.success) {
      if (onSuccess) onSuccess();
      form.reset();
    }
  }, [form, onSuccess, state?.success]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        {initialData?.id && (
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter supplier ID" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
        {state?.errors && <p className={'text-red-500'}>{state.message}</p>}
        <Button disabled={isPending} type="submit">
          {initialData ? 'Update Supplier' : 'Add Supplier'}
        </Button>
      </form>
    </Form>
  );
}
