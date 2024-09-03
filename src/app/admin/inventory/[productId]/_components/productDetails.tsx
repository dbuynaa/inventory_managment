// 'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  DollarSign,
  Truck,
  TrendingUp,
  TrendingDown,
  BarChart2,
  ArrowUpDown
} from 'lucide-react';
import { type Product } from '@prisma/client';
import InventoryLogsTab from './inventory-logs-tab';
import ProductInfoTab from './product-info-tab';
import InventoryAdjustForm from '../../_components/inventory-adjust-form';

export default function InventoryDetailsPage({
  product: productDetails
}: {
  product: Product;
}) {
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">
          {productDetails.name} - Inventory Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex justify-center items-start md:items-center">
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
              <InventoryLogsTab productId={productDetails.id} />
            </Suspense>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Increase Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Increase Stock</DialogTitle>
              </DialogHeader>

              {/* <InventoryAdjustForm product={productDetails} open /> */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock-increase" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="stock-increase"
                    type="number"
                    className="col-span-3"
                    placeholder="Enter quantity to add"
                  />
                </div>
              </div>
              <Button>Confirm Increase</Button>
            </DialogContent>
          </Dialog>
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
