// import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/trpc/server';
import { ProductForm } from '../_components/product-form';

export default async function InventoryPage({
  params
}: {
  params: { productId: string };
}) {
  const { productId } = params;
  const categories = await api.category.getAll();
  const product = await api.product.getById({ id: productId });
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <ProductForm
          categories={categories || []}
          initialData={product ?? null}
          key={productId}
        />
      </div>
    </ScrollArea>
  );
}
