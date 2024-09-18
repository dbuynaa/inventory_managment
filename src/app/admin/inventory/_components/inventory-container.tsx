'use client';

import { columns } from './columts';
import { DataTable } from '@/components/form/data-table';
import { api } from '@/trpc/react';
import { Separator } from '@/components/ui/separator';
import InventoryHeader from './inventory-header';
interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function InventoryContainer({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;

  const { data, isLoading } = api.product.getMany.useQuery(
    {
      search: searchParams.search as string,
      limit: pageLimit,
      page: page
    },
    {
      trpc: { ssr: false }
    }
  );

  return (
    <>
      <InventoryHeader />
      <Separator />
      <DataTable
        columns={columns}
        data={data?.products ?? []}
        page={page}
        limit={pageLimit}
        total={data?.total ?? 0}
        isLoading={isLoading}
      />
    </>
  );
}
