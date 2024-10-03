import { type Metadata } from 'next';
import { PageContainer } from '@/components/layout';
import { ProductForm } from '../_components/product-form';

export const metadata: Metadata = {
  title: 'Шинэ бүтээгдэхүүн',
  description: 'Шинэ бүтээгдэхүүн үүсгэх'
};

export default function InventoryNewPage() {
  return (
    <PageContainer scrollable>
      <ProductForm initialData={null} />
    </PageContainer>
  );
}
