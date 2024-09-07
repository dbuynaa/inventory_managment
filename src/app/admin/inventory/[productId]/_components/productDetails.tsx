import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  DollarSign,
  Truck,
  BarChart2,
  ArrowUpDown
} from 'lucide-react';
import { type Product } from '@prisma/client';
import InventoryLogsTab from './inventory-logs-tab';
import ProductInfoTab from './product-info-tab';
import InventoryAdjustForm from '../../_components/inventory-adjust-form';

export default function InventoryDetailsPage({
  product: productDetails,
  searchParams: { page, limit }
}: {
  product: Product;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-3xl font-bold">
          {productDetails.name} - Inventory Details
        </h1>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-start justify-center md:items-center">
            {/* <Image
            src="https://via.placeholder.com/300"
            alt={productDetails.name}
            width={300}
            height={300}
            className="rounded-lg shadow-md"
          /> */}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt={productDetails.name}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Stock
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {productDetails.quantityOnStock}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Retail Price
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${productDetails.price.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Reorder Level
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {productDetails.reorderLevel}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="history">Stock History</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <ProductInfoTab productDetails={productDetails} />
          </TabsContent>
          <TabsContent value="history">
            <Suspense fallback={<div>Loading...</div>}>
              <InventoryLogsTab
                searchParams={{ page: String(page), limit: String(limit) }}
                productId={productDetails.id}
              />
            </Suspense>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <InventoryAdjustForm product={productDetails}>
            <Button>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Adjustment
            </Button>
          </InventoryAdjustForm>
          <Button variant="secondary">
            <BarChart2 className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* {productDetails.quantityOnStock &&
        productDetails.reorderLevel &&
        productDetails.quantityOnStock <= productDetails.reorderLevel && (
          <Card className="mt-6 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-500 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The current stock level is at or below the reorder level.
                Consider restocking soon.
              </p>
            </CardContent>
          </Card>
        )} */}
      </div>
    </>
  );
}
