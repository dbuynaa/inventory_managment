// 'use client';

import { api } from '@/trpc/server';
import SupplierContainer from './_components/supplierContainer';
import { type Metadata } from 'next';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: 'Нийлүүлэгчид',
  description: 'Админ нийлүүлэгчид хуудас'
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;

  const { data, total } = await api.supplier.getMany({
    limit: pageLimit,
    page: page
  });

  return (
    <SupplierContainer data={data} total={total} searchParams={searchParams} />
  );
}
