import { type Metadata } from 'next';
import { PageContainer } from '@/components/layout';
import InventoryHeader from './_components/inventory-header';
import { Suspense } from 'react';
import { InventoryContainer } from './_components/inventory-container';
import { Separator } from '@/components/ui/separator';

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
        <InventoryHeader />
        <Separator />

        <Suspense fallback={<div>Loading...</div>}>
          <InventoryContainer searchParams={searchParams} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
