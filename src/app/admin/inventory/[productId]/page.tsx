// import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/trpc/server';
import InventoryDetailsPage from './_components/productDetails';

export default async function InventoryPage({
  params
}: {
  params: { productId: string };
}) {
  const { productId } = params;
  const product = await api.product.getById({ id: productId });

  if (!product) return null;

  return (
    <ScrollArea className="h-full">
      <InventoryDetailsPage product={product} />
    </ScrollArea>
  );
}
