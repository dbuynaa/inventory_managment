import { type Metadata } from 'next';
import { PageContainer } from '@/components/layout';
import { ProductForm } from '../_components/product-form';

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Агуулахын бүтээгдэхүүний жагсаалт'
};

export default function InventoryPage() {
  return (
    <PageContainer scrollable>
      <ProductForm initialData={null} />
    </PageContainer>
  );
}
