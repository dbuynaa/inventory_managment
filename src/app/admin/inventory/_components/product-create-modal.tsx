import { type Product } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ProductForm } from './product-form';

export default function ProductCreateModal({
  children,
  product
}: {
  product: Product | null;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog modal open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Create a new product</DialogDescription>
        </DialogHeader>
        <ProductForm
          onComplete={() => setIsDialogOpen(false)}
          initialData={product}
        />
      </DialogContent>
    </Dialog>
  );
}
