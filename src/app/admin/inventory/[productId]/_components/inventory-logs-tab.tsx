import { DataTable } from '@/components/form/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/server';
import { columns } from './columts';

export default async function InventoryLogsTab({
  searchParams,
  productId
}: {
  searchParams: Record<string, string | string[] | undefined>;
  productId: string;
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 5;
  const stockHistory = await api.inventory.getInventoryLogs({
    productId: productId,
    page: page,
    limit: limit
  });
  if (!stockHistory) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock History</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={stockHistory.data}
          page={page}
          limit={limit}
          totalProducts={stockHistory.total}
        />
      </CardContent>
    </Card>
  );
}
