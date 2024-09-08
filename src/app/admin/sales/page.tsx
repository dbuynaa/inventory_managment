import { DataTable } from '@/components/form/data-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { api } from '@/trpc/server';
import { type Metadata } from 'next';
import { salesColumns } from './_components/column';
import { SalesHeader } from './_components/sales-header';

export const metadata: Metadata = {
  title: 'Борлуулалтын Удирдлага',
  description: 'Бүх борлуулалтын бүртгэлүүдийг удирдах болон харах'
};

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}
export default async function SalesPage({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const sales = await api.sales.getMany({
    limit: limit,
    page: page
  });
  const { data, total } = sales;
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Борлуулалтын Удирдлага</h1>
      <Card>
        <CardHeader>
          <CardTitle>Борлуулалтын Жагсаалт</CardTitle>
          <CardDescription>
            Бүх борлуулалтын бүртгэлүүдийг удирдах болон харах
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SalesHeader />
          <DataTable
            columns={salesColumns}
            data={data}
            total={total}
            limit={limit}
            page={page}
          />
        </CardContent>
      </Card>
    </div>
  );
}
