import { api } from '@/trpc/server';
import { DataTable } from '@/components/form/data-table';
import { customerColumns } from './_components/column';
import CustomerHeader from './_components/customer-header';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Харилцагч',
  description: 'Харилцагчидийн жагсаалт'
};
interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function CustomerPage({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const data = await api.customer.getMany({
    limit: limit,
    page: page
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Харилцагчидийн жагсаалт</h1>
      <CustomerHeader />

      <DataTable
        columns={customerColumns}
        data={data.data}
        total={data.total}
        limit={limit}
        page={page}
      />
    </div>
  );
}
