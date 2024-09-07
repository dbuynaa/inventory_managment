'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { type Product, type InventoryLog } from '@prisma/client';
import { DataTable } from '@/components/form/data-table';
import { columns } from './';

type InventoryLogShape = InventoryLog & {
  product: Product;
};
export function InventoryLogsContainer({
  inventoryLogs,
  total,
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
  inventoryLogs: InventoryLogShape[];
  total: number;
}) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [changeTypeFilter, setChangeTypeFilter] = useState('');

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Inventory Logs</h1>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={changeTypeFilter} onValueChange={setChangeTypeFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by change type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Sale">Sale</SelectItem>
            <SelectItem value="Purchase">Purchase</SelectItem>
            <SelectItem value="Adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Log List</CardTitle>
          <CardDescription>View all inventory changes</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={inventoryLogs}
            total={total}
            columns={columns}
            page={page}
            limit={pageLimit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
