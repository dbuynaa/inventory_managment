import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { adjustmentCreateInput } from '../types';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { generateReferenceId } from '@/lib/utils';

export const inventoryRouter = createTRPCRouter({
  getInventoryLogs: protectedProcedure
    .input(
      z.object({
        productId: z.string().optional(),
        limit: z.number(),
        page: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.inventoryLog.findMany({
        where: { productId: input.productId },
        include: { product: true },
        orderBy: { createdAt: 'desc' },
        skip: (input.page - 1) * input.limit,
        take: input.limit
      });
      const total = await ctx.db.inventoryLog.count({
        where: { productId: input.productId }
      });

      return { data, total };
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

      // if (check.quantityOnStock! < Math.abs(input.quantityAdjusted)) {
      //   throw new TRPCError({
      //     code: 'BAD_REQUEST',
      //     message: 'Insufficient stock'
      //   });
      // }

      const changeType = input.quantityAdjusted > 0 ? 'INCREASED' : 'DECREASED';

      const referenceId = generateReferenceId(
        input.quantityAdjusted,
        changeType
      ); // Generate the reference_id based on quantityChange and changeType

      const logs = await ctx.db.inventoryLog.create({
        data: {
          product: { connect: { id: input.productId } },
          referenceId: referenceId,
          quantityChange: input.quantityAdjusted,
          changeType: 'ADJUSTMENT'
        }
      });

      const product = await ctx.db.inventoryAdjustment.create({
        data: {
          reason: input.reason,
          quantityAdjusted: input.quantityAdjusted,
          adjustmentType: input.adjustmentType,
          // adjustmentType: input.quantityAdjusted > 0 ? 'INCREASE' : 'DECREASE',
          inventoryLog: { connect: { id: logs.id } },
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

      return product;
    })
});
