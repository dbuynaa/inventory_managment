import { api } from '@/trpc/server';
import { PageContainer } from '@/components/layout';
import { type PurchaseOrder } from '@prisma/client';
import { OrderDetails } from './_components/order-details';

interface Props {
  params: { id: string };
}

export default async function OrderDetailsPage({ params }: Props) {
  const order = await api.order.getById({ id: params.id });

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <PageContainer>
      <OrderDetails
        order={
          order as PurchaseOrder & { supplier: { name: string } } & {
            purchaseOrderDetails: {
              product: { name: string };
              quantity: number;
              pricePerUnit: number;
            }[];
          }
        }
      />
    </PageContainer>
  );
}
