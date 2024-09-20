'use client';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { createProductOrUpdateAction } from '@/lib/actions';
import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  const action = initialData ? 'Өөрчлөлтийг хадгалах' : 'Бүтээгдэхүүн нэмэх';
  const utils = api.useUtils();
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
      await utils.product.invalidate();
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

  const handleRemoveImage = () => {
    form.reset();
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="gap-8 md:grid md:grid-cols-2">
          <FormField
            control={form.control}
            name="image"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem className="col-span-2 space-y-2 sm:row-span-4 md:col-span-1">
                <FormLabel>Бүтээгдэхүүний зураг</FormLabel>
                <Card className="relative flex h-80 w-full min-w-[200px] items-center justify-center">
                  {previewImage ? (
                    <div className="relative">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={200}
                        height={200}
                        objectFit="cover"
                        className="h-full w-full rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-0 top-0 -mr-2 -mt-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <FormControl>
                      <div className="h-full w-full">
                        <input
                          id="file-input"
                          className="hidden"
                          disabled={isPending}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(e.target.files);
                              setPreviewImage(URL.createObjectURL(file));
                            }
                          }}
                          {...rest}
                        />
                        <label
                          htmlFor="file-input"
                          className={`flex h-full w-full cursor-pointer items-center justify-center px-4 py-2 text-center ${
                            isPending ? 'cursor-not-allowed opacity-50' : ''
                          }`}
                        >
                          {isPending ? 'Uploading...' : 'Upload Image'}
                        </label>
                      </div>
                    </FormControl>
                  )}
                </Card>

                <FormDescription>
                  Бүтээгдэхүүний зургийг байршуулна уу.
                  <br /> Файлын дээд хэмжээ: 5MB. Зөвшөөрөгдсөн формат: .jpg,
                  .jpeg, .png, .webp
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
  );
};
