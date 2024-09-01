import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from '@/server/api/trpc';
import { adjustmentCreateInput, productCreateInput } from '../types';
import { AdjustmentType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(productCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { categoryId, supplierId, ..._input } = input;
      return await ctx.db.product.create({
        data: {
          costPrice: _input.costPrice,
          description: _input.description,
          name: _input.name,
          price: _input.price,
          supplier: supplierId ? { connect: { id: supplierId } } : undefined,
          category: { connect: { id: categoryId } },
          createdBy: { connect: { id: ctx.session.user.id } }
        }
      });
    }),

  update: protectedProcedure
    .input(productCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { categoryId, supplierId, id, ..._input } = input;
      return await ctx.db.product.update({
        where: { id: id },
        data: {
          ..._input,
          supplier: supplierId ? { connect: { id: supplierId } } : undefined,
          category: { connect: { id: categoryId } }
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.product.delete({ where: { id: input.id } });
    }),

  getMany: protectedProcedure
    .input(z.object({ limit: z.number(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.limit * (input.page - 1)
      });

      const total = await ctx.db.product.count();

      return { products, total };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id }
      });
      return product ?? null;
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

      return await ctx.db.product.update({
        where: { id: input.productId },
        data: {
          quantityOnStock: { increment: input.quantityAdjusted },
          inventoryAdjustment: {
            create: {
              reason: input.reason,
              quantityAdjusted: input.quantityAdjusted,
              adjustmentType: input.adjustmentType,
              adjustedBy: { connect: { id: ctx.session.user.id } }
            }
          }
        }
      });
    })
});
