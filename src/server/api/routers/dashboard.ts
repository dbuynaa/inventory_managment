import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const dashboardRouter = createTRPCRouter({
  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    const totalProducts = await ctx.db.product.count();
    const lowStockItems = await ctx.db.product.count({
      where: {
        quantityOnStock: {
          lte: 10 // Assuming low stock is 10 or less
        }
      }
    });
    const recentSales = await ctx.db.sale.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    const inventoryValue = await ctx.db.product.aggregate({
      _sum: {
        quantityOnStock: true,
        price: true
      }
    });

    return {
      totalProducts,
      lowStockItems,
      recentSales,
      inventoryValue:
        inventoryValue._sum.quantityOnStock! * inventoryValue._sum.price!
    };
  }),

  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const sales = await ctx.db.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    });

    const purchases = await ctx.db.purchaseOrder.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { supplier: true }
    });

    const adjustments = await ctx.db.inventoryAdjustment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { product: true }
    });

    const recentActivity = [
      ...sales.map((sale) => ({
        type: 'sale' as const,
        id: sale.id,
        description: `Sale to ${sale.customer.name}`,
        amount: sale.totalAmount,
        date: sale.createdAt?.toISOString().split('T')[0] ?? ''
      })),
      ...purchases.map((purchase) => ({
        type: 'purchase' as const,
        id: purchase.id,
        description: `Purchase from ${purchase.supplier.name}`,
        amount: purchase.totalAmount,
        date: purchase.createdAt.toISOString().split('T')[0]
      })),
      ...adjustments.map((adjustment) => ({
        type: 'adjustment' as const,
        id: adjustment.id,
        description: `Stock adjustment for ${adjustment.product.name}`,
        quantity: adjustment.quantityAdjusted,
        date: adjustment.createdAt?.toISOString().split('T')[0] ?? ''
      }))
    ]
      .sort(
        (a, b) =>
          new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime()
      )
      .slice(0, 5);

    return recentActivity;
  })
});
