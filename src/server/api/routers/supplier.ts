import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { supplierCreateInput } from '../types';
import { TRPCError } from '@trpc/server';

export const supplierRouter = createTRPCRouter({
  create: protectedProcedure
    .input(supplierCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { ..._input } = input;
      return await ctx.db.supplier.create({
        data: {
          name: _input.name,
          phoneNumber: _input.phoneNumber,
          email: _input.email
        }
      });
    }),

  update: protectedProcedure
    .input(supplierCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ..._input } = input;
      const check = await ctx.db.supplier.findUnique({
        where: { id: id }
      });

      if (!check) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Supplier not found'
        });
      }
      return await ctx.db.supplier.update({
        where: { id: id },
        data: _input
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const check = await ctx.db.supplier.findUnique({
        where: { id: input.id }
      });

      if (!check) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Supplier not found'
        });
      }
      return await ctx.db.supplier.delete({ where: { id: input.id } });
    }),

  getMany: protectedProcedure
    .input(z.object({ limit: z.number(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.supplier.findMany({
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.limit * (input.page - 1)
      });

      const total = await ctx.db.supplier.count();

      return { data, total };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supplier = await ctx.db.supplier.findUnique({
        where: { id: input.id }
      });
      return supplier ?? null;
    })
});
