import { api } from '@/trpc/server';
import { type Metadata } from 'next';
import InventoryContainer from './_components/inventory-container';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Admin inventory page'
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;
  const data = await api.product.getMany({
    limit: pageLimit,
    page: page
  });
  const total = data.total;

  return (
    <InventoryContainer
      data={data.products}
      total={total}
      searchParams={searchParams}
    />
  );
}
