'use client';
import type * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { type Category, type Product } from '@prisma/client';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modal/alert-modal';
import { Heading } from '@/components/ui/heading';
import { productCreateInput } from '@/server/api/types';
import { FormInput } from '@/components/form/form-item';
export const IMG_MAX_LIMIT = 3;

type ProductFormValues = z.infer<typeof productCreateInput>;

interface ProductFormProps {
  initialData: Product | null;
  categories: Category[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories
}) => {
  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const action = initialData ? 'Save changes' : 'Create';

  const { mutate: deleteProduct, isPending: deleteLoading } =
    api.product.delete.useMutation({
      onSuccess: () => {
        toast({
          title: 'Product deleted.'
        });
      },
      onSettled: async () => {
        setOpen(false);
        await utils.product.invalidate();
        router.push('/admin/inventory');
      },
      onError: (message) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message.message
        });
      }
    });

  const { mutate: createProduct, isPending: loadingCreate } =
    api.product.create.useMutation({
      onSuccess: () => {
        toast({
          title: 'Product created.'
        });
      },
      onSettled: async () => {
        router.push('/admin/inventory');
        await utils.product.invalidate();
      },
      onError: (message) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message.message
        });
      }
    });

  const { mutate: updateProduct, isPending: loadingUpdate } =
    api.product.update.useMutation({
      onSuccess: () => toast({ title: 'Product updated.' }),
      onSettled: async () => {
        await utils.product.invalidate();
        router.push('/admin/inventory');
      },
      onError: (message) =>
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message.message
        })
    });

  const defaultValues: ProductFormValues = {
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? 0,
    quantity: initialData?.quantity ?? 0,
    categoryId: initialData?.categoryId ?? ''
  };
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productCreateInput),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (initialData?.id) {
      updateProduct({ ...data, id: initialData?.id });
    } else createProduct(data);
  };

  const onDelete = () => {
    if (!initialData?.id) return;
    deleteProduct({ id: initialData.id });
  };

  const loading = loadingCreate || loadingUpdate || deleteLoading;

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={deleteLoading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={initialData?.id ? 'Update' : 'Create'}
          description={
            initialData?.id ? 'Update product' : 'Create new product'
          }
        />
        {initialData?.id && (
          <Button
            disabled={deleteLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormInput
              form={form}
              label="Name"
              name="name"
              inputProps={{
                disabled: loading,
                placeholder: 'Product name'
              }}
            />
            <FormInput
              form={form}
              label="Description"
              name="description"
              inputProps={{
                disabled: loading,
                placeholder: 'Product description'
              }}
            />
            <FormInput
              form={form}
              label="Price"
              name="price"
              inputProps={{
                type: 'number',
                disabled: loading
              }}
            />
            <FormInput
              form={form}
              label="Quantity"
              name="quantity"
              inputProps={{ disabled: loading, type: 'number' }}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
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
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
