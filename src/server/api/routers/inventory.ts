import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { adjustmentCreateInput } from '../types';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const inventoryRouter = createTRPCRouter({
  getInventoryLogs: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.inventoryLog.findMany({
        where: { productId: input.productId }
      });
    }),
  productAdjustment: protectedProcedure
    .input(adjustmentCreateInput)
    .mutation(async ({ ctx, input }) => {
      const check = await ctx.db.product.findUnique({
        where: { id: input.productId }
      });

      if (!check)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found'
        });

      const product = await ctx.db.inventoryAdjustment.create({
        data: {
          reason: input.reason,
          quantityAdjusted: input.quantityAdjusted,
          adjustmentType: 'ADJUSTED',
          product: { connect: { id: input.productId } },
          adjustedBy: { connect: { id: ctx.session.user.id } }
        }
      });
      await ctx.db.product.update({
        where: { id: input.productId },
        data: {
          quantityOnStock: { increment: input.quantityAdjusted }
        }
      });

      await ctx.db.inventoryLog.create({
        data: {
          product: { connect: { id: input.productId } },
          quantityChange: input.quantityAdjusted,
          changeType: 'ADJUSTED'
        }
      });

      return product;
    })
});
