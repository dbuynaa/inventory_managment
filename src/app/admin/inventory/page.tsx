import { type Metadata } from 'next';
import InventoryContainer from './_components/inventory-container';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import InventoryHeader from './_components/inventory-header';
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
        <InventoryHeader />
        <Separator />

        <Suspense fallback={<InventoryDataTableLoading />}>
          <InventoryContainer searchParams={searchParams} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

const InventoryDataTableLoading = () => {
  return (
    <div className="h-full w-full">
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-8 w-4/5" />
    </div>
  );
};
