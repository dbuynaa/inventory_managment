import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { type z } from 'zod';
import { customerCreateInput } from '@/server/api/types';

type Customer = z.infer<typeof customerCreateInput>;

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
  initialData?: Customer;
}

export default function CustomerForm({
  onSubmit,
  initialData
}: CustomerFormProps) {
  const form = useForm<Customer>({
    resolver: zodResolver(customerCreateInput),
    defaultValues: initialData ?? {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  function onSubmitForm(data: Customer) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? 'Харилцагчийн мэдээллийг засах'
              : 'Шинэ харилцагч нэмэх'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Харилцагчийн мэдээллийг энд засна уу.'
              : 'Шинэ харилцагчийн мэдээллийг оруулна уу.'}
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нэр</FormLabel>
              <FormControl>
                <Input placeholder="Жон Доу" {...field} />
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
              <FormLabel>Имэйл</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Утасны дугаар</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Хаяг</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">
            {initialData ? 'Өөрчлөлтийг хадгалах' : 'Харилцагч нэмэх'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
