import { api } from '@/trpc/server';
import { DataTable } from '@/components/form/data-table';
import { customerColumns } from './_components/column';
import CustomerHeader from './_components/customer-header';

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
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
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
