'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
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
export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' }),
  description: z
    .string()
    .min(3, { message: 'Product description must be at least 3 characters' }),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  categoryId: z.string().min(1, { message: 'Please select a category' })
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: Product | null;
  categories: Category[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const action = initialData ? 'Save changes' : 'Create';

  const { mutate, isPending: loading } = api.product.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Product created.'
      });
      setOpen(false);
      router.refresh();
    },
    onError: (message) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message.message
      });
    }
  });

  const defaultValues: ProductFormValues = {
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? 0,
    quantity: initialData?.quantity ?? 0,
    categoryId: initialData?.categoryId ?? ''
  };
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    mutate(data);
  };

  const onDelete = () => {
    if (!initialData?.id) return;
    router.refresh();
    // router.push(`/${params.storeId}/products`);
  };

  // const triggerImgUrlValidation = () => form.trigger('imgUrl');

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        // loading={deleteLoading}
      /> */}
      <div className="flex items-center justify-between">
        {/* <Heading title={title} description={description} /> */}
        {initialData?.id && (
          <Button
            // disabled={deleteLoading}
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
          {/* <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUpload
                    onChange={field.onChange}
                    value={field.value}
                    onRemove={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
