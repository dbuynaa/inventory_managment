'use client';

import { PageContainer } from '@/components/layout';
import { Separator } from '@/components/ui/separator';
import { columns } from './columts';
import { DataTable } from '@/components/form/data-table';
import InventoryHeader from './inventory-header';
import { type Product } from '@prisma/client';
import InventoryAdjustForm from './inventory-adjust-form';
import { useState } from 'react';
import ProductCreateModal from './product-create-modal';
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
  const [openAdjustModal, setOpenAdjustModal] = useState(false);
  const [createProductModal, setCreateProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEditClick = ({ product }: { product: Product }) => {
    setSelectedProduct(product);
    setOpenAdjustModal(true);
  };
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
    <div>
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
          <InventoryHeader
            setProductDialogOpen={setCreateProductModal}
            total={total}
          />
          <Separator />

          <DataTable
            columns={columns(handleEditClick, handleDeleteClick)}
            data={data ?? []}
            page={page}
            limit={pageLimit}
            totalProducts={total}
          />
          {createProductModal && (
            <ProductCreateModal
              isOpen={createProductModal}
              product={null}
              onClose={() => setCreateProductModal(false)}
            />
          )}
          {selectedProduct && (
            <InventoryAdjustForm
              product={selectedProduct}
              open={openAdjustModal}
              onOpenChange={setOpenAdjustModal}
            />
          )}
        </div>
      </PageContainer>
    </div>
  );
}
