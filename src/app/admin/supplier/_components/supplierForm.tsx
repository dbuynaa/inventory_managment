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

interface SupplierFormProps {
  initialData?: SupplierFormData;
  onSuccess?: () => void;
}

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
        description: 'Нийлүүлэгч амжилттай хадгалагдлаа',
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
              <FormLabel>Нийлүүлэгчийн нэр</FormLabel>
              <FormControl>
                <Input placeholder="Нийлүүлэгчийн нэр оруулна уу" {...field} />
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
              <FormLabel>Утасны дугаар</FormLabel>
              <FormControl>
                <Input placeholder="Утасны дугаар оруулна уу" {...field} />
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
              <FormLabel>И-мэйл</FormLabel>
              <FormControl>
                <Input
                  placeholder="И-мэйл оруулна уу"
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {state?.errors && <p className={'text-red-500'}>{state.message}</p>} */}
        <Button disabled={loading} type="submit">
          {initialData
            ? 'Нийлүүлэгчийн мэдээллийг шинэчлэх'
            : 'Нийлүүлэгч нэмэх'}
        </Button>
      </form>
    </Form>
  );
}
