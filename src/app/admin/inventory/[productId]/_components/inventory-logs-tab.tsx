import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { api } from '@/trpc/server';

export default async function InventoryLogsTab({
  productId
}: {
  productId: string;
}) {
  const stockHistory = await api.inventory.getInventoryLogs({
    productId
  });
  if (!stockHistory) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockHistory.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.changedAt.toISOString()}</TableCell>
                <TableCell
                  className={
                    entry.quantityChange > 0 ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {entry.quantityChange > 0 ? '+' : ''}
                  {entry.quantityChange}
                </TableCell>
                <TableCell>{entry.changeType}</TableCell>
                <TableCell>{entry.productId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
