// 'use client';

import { api } from '@/trpc/server';
import SupplierContainer from './_components/supplierContainer';
import { type Metadata } from 'next';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: 'Suppliers',
  description: 'Admin suppliers page'
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;

  const data = await api.supplier.getMany({
    limit: pageLimit,
    page: page
  });

  return (
    <SupplierContainer
      data={data.supplier}
      total={data.total}
      searchParams={searchParams}
    />
  );
}
