'use client';

import { PageContainer } from '@/components/layout';
import { Separator } from '@/components/ui/separator';
import { columns } from './columts';
import { DataTable } from '@/components/form/data-table';
import InventoryHeader from './inventory-header';
import { type Product } from '@prisma/client';
import InventoryAdjustForm from './inventory-adjust-form';
import { useState } from 'react';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
  data: Product[];
  total: number;
}

export default function InventoryContainer({
  searchParams,
  data,
  total
}: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditClick = ({ product }: { product: Product }) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <InventoryHeader total={total} />
        <Separator />

        <DataTable
          columns={columns(handleEditClick)}
          data={data ?? []}
          page={page}
          limit={pageLimit}
          totalProducts={total}
        />
        {selectedProduct && (
          <InventoryAdjustForm
            product={selectedProduct}
            open={open}
            onOpenChange={setOpen}
          />
        )}
      </div>
    </PageContainer>
  );
}
