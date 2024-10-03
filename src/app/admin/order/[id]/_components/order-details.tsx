'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { OrderStatus, type PurchaseOrder } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface OrderDetailsProps {
  order: PurchaseOrder & {
    supplier: { name: string };
    purchaseOrderDetails: {
      product: { name: string };
      quantity: number;
      pricePerUnit: number;
    }[];
  };
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const updateStatus = api.order.updateStatus.useMutation({
    onSuccess: () => {
      toast({
        title: 'Status updated',
        description: 'The order status has been updated successfully.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateStatus.mutate({ id: order.id, status: newStatus });
    setStatus(newStatus);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Order ID:</p>
              <p>{order.id}</p>
            </div>
            <div>
              <p className="font-semibold">Supplier:</p>
              <p>{order.supplier.name}</p>
            </div>
            <div>
              <p className="font-semibold">Order Date:</p>
              <p>{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Expected Delivery:</p>
              <p>{new Date(order.expectedDeliveryDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Total Amount:</p>
              <p>${order.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <Select
                value={status}
                onValueChange={(value) =>
                  handleStatusChange(value as OrderStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(OrderStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Price Per Unit</th>
                <th className="text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.purchaseOrderDetails.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.pricePerUnit.toFixed(2)}</td>
                  <td>${(item.quantity * item.pricePerUnit).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
