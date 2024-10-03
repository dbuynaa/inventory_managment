import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const reportsRouter = createTRPCRouter({
  getPurchaseOrderSummary: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.purchaseOrder.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      _sum: {
        totalAmount: true
      }
    });
  }),
  getRecentSales: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.sale.findMany({
      take: 5,
      orderBy: { saleDate: 'desc' },
      include: { customer: true }
    });
  }),
  getRecentInventoryAdjustments: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.inventoryAdjustment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { product: true, adjustedBy: true }
    });
  })
});
