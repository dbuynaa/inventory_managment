import { api } from '@/trpc/server';
import { type Metadata } from 'next';
import { InventoryLogsContainer } from './_components';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: 'Барааны бүртгэл',
  description: 'Админ барааны бүртгэлийн хуудс'
};

export default async function InventoryLogsPage({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;
  const { data, total } = await api.inventory.getInventoryLogs({
    limit: pageLimit,
    page: page
  });

  return (
    <InventoryLogsContainer
      inventoryLogs={data ?? []}
      total={total}
      page={page}
      limit={pageLimit}
    />
  );
}
