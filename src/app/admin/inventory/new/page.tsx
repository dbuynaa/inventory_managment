import { type Metadata } from 'next';
import { PageContainer } from '@/components/layout';
import { ProductForm } from '../_components/product-form';
import { api } from '@/trpc/server';

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Агуулахын бүтээгдэхүүний жагсаалт'
};

export default async function InventoryPage({
  params
}: {
  params: { productId?: string };
}) {
  const { productId } = params;
  const initialData = productId
    ? await api.product.getById({ id: productId })
    : null;
  return (
    <PageContainer scrollable>
      <ProductForm initialData={initialData} />
    </PageContainer>
  );
}
