import { type Metadata } from 'next';
import { PageContainer } from '@/components/layout';
import { api } from '@/trpc/server';
import { ProductForm } from '../../_components/product-form';

export const metadata: Metadata = {
  title: 'Бүтээгдэхүүний өөрчлөлт',
  description: 'Бүтээгдэхүүний өөрчлөлт үүсгэх'
};

export default async function InventoryEditPage({
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
