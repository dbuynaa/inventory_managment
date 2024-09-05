'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { orderCreateInput } from '@/server/api/types';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { type z } from 'zod';

type Order = z.infer<typeof orderCreateInput>;
export function CreateOrderModal() {
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);

  const form = useForm<Order>({
    resolver: zodResolver(orderCreateInput),
    defaultValues: {
      supplierId: '',
      expectedDeliveryDate: undefined,
      products: [{ productId: '', quantity: 1 }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products'
  });

  const { toast } = useToast();
  const router = useRouter();

  const { data: suppliers } = api.supplier.getMany.useQuery({
    limit: 10,
    page: 1
  });

  const { data: productsData } = api.product.getMany.useQuery({
    supplierId: form.watch('supplierId'),
    limit: 10,
    page: 1
  });

  const { mutate: createOrder } = api.order.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Order created successfully',
        description: 'Your order has been created successfully.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    },
    onSettled: () => {
      setIsNewOrderDialogOpen(false);
      form.reset();
      router.refresh();
    }
  });

  const onSubmit = (data: Order) => {
    createOrder(data);
  };

  const watchedProducts = useWatch({
    control: form.control,
    name: 'products'
  });

  useEffect(() => {
    watchedProducts.forEach((product, index) => {
      if (product.productId && product.quantity > 0) {
        const selectedProduct = productsData?.products?.find(
          (p) => p.id === product.productId
        );
        if (selectedProduct) {
          const pricePerUnit = selectedProduct.price;
          const totalAmount = pricePerUnit * product.quantity;

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

  const handleAddProduct = () => {
    append({ productId: '', quantity: 1, pricePerUnit: 0, totalPrice: 0 });
  };

  return (
    <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Create Purchase Order
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[675px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create New Purchase Order</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new purchase order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers?.data.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
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
                name="expectedDeliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Delivery Date</FormLabel>
                    <FormControl>
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[280px] justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={new Date(field.value)}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      {/* <Input type="date" {...field} /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-10 items-center gap-4"
                >
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
                    name={`products.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                              // const selectedProduct = productsData?.products.find(
                              //   (product) => product.id === field.value
                              // )
                              // form.setValue(
                              //   `products.${index}.totalAmount`,

                              // );
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
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
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
            </div>
            <DialogFooter>
              <Button type="submit">Create Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
