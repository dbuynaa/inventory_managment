'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCreateModal from '../../_components/product-create-modal';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { type Product } from '@prisma/client';

export default function ProductInfoTab({
  productDetails
}: {
  productDetails: Product;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            Product Information
            <ProductCreateModal product={productDetails}>
              <Button variant="ghost">
                <Icons.edit className="h-4 w-4" />
              </Button>
            </ProductCreateModal>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
