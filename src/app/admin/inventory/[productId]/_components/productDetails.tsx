'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  DollarSign,
  Truck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart2
} from 'lucide-react';
import { type Product } from '@prisma/client';

// Mock data - replace with actual API calls in a real application
// const productDetails = {
//   product_id: 1,
//   name: 'Premium Wireless Mouse',
//   sku: 'WM001',
//   description:
//     'Ergonomic wireless mouse with precision tracking and long battery life.',
//   barcode: '123456789',
//   price: 49.99,
//   cost_price: 25.0,
//   quantity_in_stock: 150,
//   reorder_level: 50,
//   location: 'Warehouse A',
//   category: { name: 'Computer Accessories' },
//   supplier: { name: 'TechGear Supplies' }
// };

const stockHistory = [
  {
    date: '2023-05-01',
    change: 100,
    type: 'Purchase Order',
    reference: 'PO-001'
  },
  { date: '2023-05-15', change: -20, type: 'Sale', reference: 'S-001' },
  { date: '2023-05-20', change: -5, type: 'Adjustment', reference: 'ADJ-001' },
  {
    date: '2023-06-01',
    change: 75,
    type: 'Purchase Order',
    reference: 'PO-002'
  }
];

export default function InventoryDetailsPage({
  product: productDetails
}: {
  product: Product;
}) {
  // const [quantity, setQuantity] = useState(productDetails.quantity_in_stock);

  // const handleStockChange = (amount: number) => {
  //   setQuantity((prev) => Math.max(0, prev + amount));
  // };

  return (
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
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
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
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{productDetails.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
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
                      <TableCell>{entry.date}</TableCell>
                      <TableCell
                        className={
                          entry.change > 0 ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {entry.change > 0 ? '+' : ''}
                        {entry.change}
                      </TableCell>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell>{entry.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Increase Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Increase Stock</DialogTitle>
            </DialogHeader>
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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <TrendingDown className="mr-2 h-4 w-4" />
              Decrease Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decrease Stock</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock-decrease" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="stock-decrease"
                  type="number"
                  className="col-span-3"
                  placeholder="Enter quantity to remove"
                />
              </div>
            </div>
            {/* <Button variant="outline" onClick={() => handleStockChange(-10)}>
              Confirm Decrease
            </Button> */}
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
  );
}
