import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { customerCreateInput } from '../types';
import { TRPCError } from '@trpc/server';

export const customerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(customerCreateInput)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.customer.create({
        data: input
      });

      return data;
    }),

  update: protectedProcedure
    .input(customerCreateInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.customer.update({
        where: { id: input.id },
        data: input
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.customer.delete({ where: { id: input.id } });
    }),

  getMany: protectedProcedure
    .input(z.object({ limit: z.number(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.customer.findMany({
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.limit * (input.page - 1)
      });

      const total = await ctx.db.product.count();

      return { data, total };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const check = await ctx.db.customer.findUnique({
        where: { id: input.id }
      });

      if (!check) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Customer not found'
        });
      }
      return check;
    })
});
