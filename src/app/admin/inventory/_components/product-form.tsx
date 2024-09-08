'use client';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { type Product } from '@prisma/client';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { productCreateInput } from '@/server/api/types';
import { FormInput } from '@/components/form/form-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createProductOrUpdateAction } from '@/lib/actions';
import { useState } from 'react';

type ProductFormValues = z.infer<typeof productCreateInput>;

interface ProductFormProps {
  initialData: Product | null;
  onComplete?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onComplete
}) => {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const action = initialData ? 'Өөрчлөлтийг хадгалах' : 'Бүтээгдэхүүн нэмэх';

  const { data: suppliers } = api.supplier.getMany.useQuery({
    limit: 100,
    page: 1
  });
  const { data: categories } = api.category.getAll.useQuery();

  const defaultValues: ProductFormValues = {
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? 0,
    costPrice: initialData?.costPrice ?? 0,
    quantityOnStock: initialData?.quantityOnStock ?? 0,
    categoryId: initialData?.categoryId ?? '',
    reorderLevel: initialData?.reorderLevel ?? 0,
    supplierId: initialData?.supplierId ?? ''
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productCreateInput),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsPending(true);
    const { success, message } = await createProductOrUpdateAction({
      ...data,
      id: initialData?.id
    });
    if (success) {
      toast({
        title: 'Амжилттай',
        description: message
      });
    } else {
      toast({
        title: 'Алдаа гарлаа',
        description: message
      });
    }

    form.reset();
    onComplete?.();
    setIsPending(false);
  };

  return (
    <ScrollArea>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-2">
            <FormInput
              form={form}
              label="Нэр"
              name="name"
              inputProps={{
                disabled: isPending,
                placeholder: 'Бүтээгдэхүүний нэр'
              }}
            />
            <FormInput
              form={form}
              label="Тайлбар"
              name="description"
              inputProps={{
                disabled: isPending,
                placeholder: 'Бүтээгдэхүүний тайлбар'
              }}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ангилал</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Ангилал сонгох"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нийлүүлэгч</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Нийлүүлэгч сонгох"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers?.data.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormInput
              form={form}
              label="Үнэ"
              name="price"
              inputProps={{
                type: 'number',
                disabled: isPending
              }}
            />
            <FormInput
              form={form}
              label="Нөөцийн хэмжээ"
              name="quantityOnStock"
              inputProps={{ disabled: isPending, type: 'number' }}
            />
            <FormInput
              form={form}
              label="Өртгийн үнэ"
              name="costPrice"
              inputProps={{ disabled: isPending, type: 'number' }}
            />
            <FormInput
              form={form}
              label="Дахин захиалгын түвшин"
              name="reorderLevel"
              inputProps={{ disabled: isPending, type: 'number' }}
            />
          </div>
          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};
