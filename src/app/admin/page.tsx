'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Plus,
  FileText
} from 'lucide-react';

// Mock data - replace with actual API calls in a real application
const mockMetrics = {
  totalProducts: 1250,
  lowStockItems: 23,
  recentSales: 158,
  pendingOrders: 7,
  inventoryValue: 287500
};

const mockRecentActivity = [
  {
    type: 'sale',
    id: 'S001',
    description: 'Sale to Customer A',
    amount: 1299.99,
    date: '2023-06-15'
  },
  {
    type: 'purchase',
    id: 'PO002',
    description: 'Purchase Order from Supplier X',
    amount: 5000,
    date: '2023-06-14'
  },
  {
    type: 'adjustment',
    id: 'ADJ003',
    description: 'Stock adjustment for Product Y',
    quantity: -5,
    date: '2023-06-13'
  },
  {
    type: 'sale',
    id: 'S004',
    description: 'Sale to Customer B',
    amount: 799.5,
    date: '2023-06-12'
  },
  {
    type: 'purchase',
    id: 'PO005',
    description: 'Purchase Order from Supplier Z',
    amount: 3500,
    date: '2023-06-11'
  }
];

export default function DashboardPage() {
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [isNewPurchaseOrderDialogOpen, setIsNewPurchaseOrderDialogOpen] =
    useState(false);
  const [isNewSaleDialogOpen, setIsNewSaleDialogOpen] = useState(false);
  const [isNewAdjustmentDialogOpen, setIsNewAdjustmentDialogOpen] =
    useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMetrics.totalProducts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMetrics.lowStockItems}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.recentSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockMetrics.inventoryValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Dialog
          open={isNewProductDialogOpen}
          onOpenChange={setIsNewProductDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> New Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details for the new product.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">
                  SKU
                </Label>
                <Input id="sku" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input id="price" type="number" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isNewPurchaseOrderDialogOpen}
          onOpenChange={setIsNewPurchaseOrderDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" /> New Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Enter the details for the new purchase order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">
                  Supplier
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier1">Supplier 1</SelectItem>
                    <SelectItem value="supplier2">Supplier 2</SelectItem>
                    <SelectItem value="supplier3">Supplier 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Order Date
                </Label>
                <Input id="date" type="date" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isNewSaleDialogOpen}
          onOpenChange={setIsNewSaleDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" /> Record Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
              <DialogDescription>
                Enter the details for the new sale.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer" className="text-right">
                  Customer
                </Label>
                <Input id="customer" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="amount" type="number" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Record Sale</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isNewAdjustmentDialogOpen}
          onOpenChange={setIsNewAdjustmentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" /> Inventory Adjustment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make Inventory Adjustment</DialogTitle>
              <DialogDescription>
                Enter the details for the inventory adjustment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">
                  Product
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product1">Product 1</SelectItem>
                    <SelectItem value="product2">Product 2</SelectItem>
                    <SelectItem value="product3">Product 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input id="quantity" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Input id="reason" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Make Adjustment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest transactions and inventory changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount/Quantity</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentActivity.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.type}</TableCell>
                  <TableCell>{activity.id}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>
                    {activity.type === 'adjustment'
                      ? activity.quantity
                      : `$${activity.amount?.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{activity.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
