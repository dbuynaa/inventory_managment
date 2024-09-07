import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { salesCreateInput } from '../types';
import { TRPCError } from '@trpc/server';

export const salesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(salesCreateInput)
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          id: {
            in: input.products.map((product) => product.productId)
          }
        }
      });

      if (products.length !== input.products.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Product not found'
        });
      }
      const calculateTotal = () => {
        return input.products
          .map((product) => product.pricePerUnit * product.quantitySold)
          .reduce((a, b) => a + b, 0);
      };
      const data = await ctx.db.sale.create({
        data: {
          paymentMethod: input.paymentMethod,
          status: input.status,
          totalAmount: calculateTotal(),
          createdBy: ctx.session.user.id,
          customer: {
            connect: { id: input.customerId }
          },
          salesDetails: {
            createMany: {
              data: input.products
            }
          }
        }
      });

      await ctx.db.product.updateMany({
        where: {
          id: {
            in: input.products.map((product) => product.productId)
          }
        },
        data: {
          quantityOnStock: {
            decrement: input.products
              .map((product) => product.quantitySold)
              .reduce((a, b) => a + b, 0)
          }
        }
      });

      await ctx.db.inventoryLog.createMany({
        data: input.products.map((product) => ({
          changeType: 'SALE',
          quantityChange: -product.quantitySold,
          productId: product.productId
        }))
      });

      return data;
    }),

  update: protectedProcedure
    .input(salesCreateInput)
    .mutation(async ({ ctx, input }) => {
      const calculateTotal = () => {
        return input.products
          .map((product) => product.pricePerUnit * product.quantitySold)
          .reduce((a, b) => a + b, 0);
      };
      return await ctx.db.sale.update({
        where: { id: input.id },
        data: {
          paymentMethod: input.paymentMethod,
          status: input.status,
          customer: {
            connect: { id: input.customerId }
          },
          totalAmount: calculateTotal()
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.sale.delete({ where: { id: input.id } });
    }),

  getMany: protectedProcedure
    .input(z.object({ limit: z.number(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.sale.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          salesDetails: {
            include: { product: true }
          },
          customer: true
        },
        take: input.limit,
        skip: input.limit * (input.page - 1)
      });

      const total = await ctx.db.product.count();

      return { data, total };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.sale.findUnique({
        where: { id: input.id },
        include: {
          customer: true
        }
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
