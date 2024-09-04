import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { orderCreateInput, productCreateInput } from '../types';
import { TRPCError } from '@trpc/server';

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(orderCreateInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.purchaseOrder.create({
        data: {
          expectedDeliveryDate: input.expectedDeliveryDate,
          totalAmount: input.totalAmount,
          status: 'PENDING',
          supplier: { connect: { id: input.supplierId } },
          orderedBy: { connect: { id: ctx.session.user.id } },
          purchaseOrderDetails: {
            createMany: {
              data: input.orderDetails
            }
          }
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

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id }
      });

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found'
        });
      }
      return product;
    })
});
