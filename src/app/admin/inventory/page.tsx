import { type Metadata } from 'next';
import InventoryContainer from './_components/inventory-container';
import { PageContainer } from '@/components/layout';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Агуулахын бүтээгдэхүүний жагсаалт'
};

export default function InventoryPage({ searchParams }: paramsProps) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <InventoryContainer searchParams={searchParams} />
      </div>
    </PageContainer>
  );
}
