import { api } from '@/trpc/server';
import { type Metadata } from 'next';
import InventoryContainer from './_components/inventory-container';
import { Suspense } from 'react';
import Loading from './loading';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Admin inventory page'
};

export default async function InventoryPage({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;
  const data = await api.product.getMany({
    limit: pageLimit,
    page: page
  });

  return (
    <Suspense fallback={<Loading />}>
      <InventoryContainer
        data={data.products}
        total={data.total}
        searchParams={searchParams}
      />
    </Suspense>
  );
}
