import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from '@/server/api/trpc';
import { productCreateInput } from '../types';

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(productCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { categoryId, supplierId, ..._input } = input;
      return await ctx.db.product.create({
        data: {
          ..._input,
          // supplier: { connect: { id: supplierId } },
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
          // supplier: { connect: { id: supplierId } },
          category: { connect: { id: categoryId } }
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.product.delete({ where: { id: input.id } });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      orderBy: { createdAt: 'desc' }
      // where: { createdBy: { id: ctx.session.user.id } }
    });

    return products ?? null;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id }
      });
      return product ?? null;
    })
});
