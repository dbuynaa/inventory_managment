'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import ProductCreateModal from '../../_components/product-create-modal';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { type Product } from '@prisma/client';

export default function ProductInfoTab({
  productDetails
}: {
  productDetails: Product;
}) {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  return (
    <>
      {updateModalOpen && (
        <ProductCreateModal
          onClose={() => setUpdateModalOpen(false)}
          product={productDetails}
          isOpen={updateModalOpen}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            Product Information
            <Button variant="ghost" onClick={() => setUpdateModalOpen(true)}>
              <Icons.edit className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium">SKU</dt>
              <dd>{productDetails.sku}</dd>
            </div>
            <div>
              <dt className="font-medium">Barcode</dt>
              <dd>{productDetails.barcode}</dd>
            </div>
            <div>
              <dt className="font-medium">Category</dt>
              {/* <dd>{productDetails.category.name}</dd> */}
            </div>
            <div>
              <dt className="font-medium">Supplier</dt>
              {/* <dd>{productDetails.supplier.name}</dd> */}
            </div>
            <div>
              <dt className="font-medium">Location</dt>
              <dd>{'Warehouse A'}</dd>
            </div>
            <div>
              <dt className="font-medium">Cost Price</dt>
              <dd>${productDetails.costPrice.toFixed(2)}</dd>
            </div>
          </dl>
        </CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{productDetails.description}</p>
          </CardContent>
        </Card>
      </Card>
    </>
  );
}
