'use client';

import { PageContainer } from '@/components/layout';
import { Separator } from '@/components/ui/separator';
import { columns } from './columts';
import { DataTable } from '@/components/form/data-table';
import InventoryHeader from './inventory-header';
import { type Product } from '@prisma/client';
import { useState } from 'react';
import { AlertModal } from '@/components/modal/alert-modal';
import { deleteProduct } from '@/lib/actions';

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
  const [deleteProductId, setDeleteProductId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = ({ id }: { id: string }) => {
    setDeleteProductId(id);
    setOpen(true);
  };
  const onDelete = async () => {
    if (!deleteProductId) return;
    setLoading(true);
    await deleteProduct(deleteProductId);
    setLoading(false);
    setOpen(false);
    setDeleteProductId('');
  };

  return (
    <>
      {deleteProductId && (
        <AlertModal
          title="Delete Product"
          description="Are you sure you want to delete this product?"
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setDeleteProductId('');
          }}
          onConfirm={onDelete}
          confirmText="Delete"
          loading={loading}
        />
      )}

      <PageContainer scrollable>
        <div className="space-y-4">
          <InventoryHeader total={total} />
          <Separator />

          <DataTable
            columns={columns(handleDeleteClick)}
            data={data ?? []}
            page={page}
            limit={pageLimit}
            total={total}
          />
        </div>
      </PageContainer>
    </>
  );
}
