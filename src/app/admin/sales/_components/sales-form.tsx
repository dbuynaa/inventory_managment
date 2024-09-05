import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { type z } from 'zod';
import { salesCreateInput } from '@/server/api/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { api } from '@/trpc/react';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { SalesStatus } from '@prisma/client';

type Sale = z.infer<typeof salesCreateInput>;

type SaleFormProps = {
  onSubmit: (customer: Sale) => void;
  initialData?: Sale;
};

export default function SaleForm({ onSubmit, initialData }: SaleFormProps) {
  const form = useForm<Sale>({
    resolver: zodResolver(salesCreateInput),
    defaultValues: initialData ?? {
      customerId: '',
      status: 'PENDING',
      paymentMethod: 'Credit Card',
      products: [
        {
          productId: '',
          quantitySold: 1,
          pricePerUnit: 0,
          totalPrice: 0
        }
      ]
    }
  });

  const { data: productsData } = api.product.getMany.useQuery({
    // supplierId: form.watch('supplierId'),
    limit: 10,
    page: 1
  });

  const { data: customers } = api.customer.getMany.useQuery({
    limit: 10,
    page: 1
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products'
  });

  const handleAddProduct = () => {
    append({ productId: '', quantitySold: 1, pricePerUnit: 0, totalPrice: 0 });
  };

  function onSubmitForm(data: Sale) {
    onSubmit(data);
    form.reset();
  }

  const watchedProducts = useWatch({
    control: form.control,
    name: 'products'
  });

  useEffect(() => {
    watchedProducts.forEach((product, index) => {
      if (product.productId && product.quantitySold > 0) {
        const selectedProduct = productsData?.products?.find(
          (p) => p.id === product.productId
        );
        if (selectedProduct) {
          const pricePerUnit = selectedProduct.price;
          const totalAmount = pricePerUnit * product.quantitySold;

          if (
            pricePerUnit !== product.pricePerUnit ||
            totalAmount !== product.totalPrice
          ) {
            form.setValue(`products.${index}.pricePerUnit`, pricePerUnit, {
              shouldValidate: true
            });
          }
          if (totalAmount !== product.totalPrice) {
            form.setValue(`products.${index}.totalPrice`, totalAmount, {
              shouldValidate: true
            });
          }
        }
      }
    });
  }, [watchedProducts, form, productsData?.products]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers?.data.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
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
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(SalesStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-10 items-center gap-4">
            <FormField
              control={form.control}
              name={`products.${index}.productId`}
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Product</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productsData?.products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
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
              name={`products.${index}.quantitySold`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                      }}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`products.${index}.pricePerUnit`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Price Per Unit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`products.${index}.totalPrice`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Total Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      readOnly
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="col-span-1 self-end"
              onClick={() => remove(index)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={handleAddProduct} variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Product
        </Button>
        <DialogFooter>
          <Button type="submit">Create Sale</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
