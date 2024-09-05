import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { orderCreateInput, productCreateInput } from '../types';
import { TRPCError } from '@trpc/server';

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(orderCreateInput)
    .mutation(async ({ ctx, input }) => {
      // const totalPrice = input.products.map((product) => product.pricePerUnit * product.quantity).reduce((a, b) => a + b, 0);

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
      const checkSupplier = await ctx.db.supplier.findUnique({
        where: { id: input.supplierId }
      });

      if (!checkSupplier) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Supplier not found'
        });
      }

      const calculateTotal = () => {
        return input.products
          .map((product) => product.pricePerUnit * product.quantity)
          .reduce((a, b) => a + b, 0);
      };

      const order = await ctx.db.purchaseOrder.create({
        data: {
          expectedDeliveryDate: input.expectedDeliveryDate,
          totalAmount: calculateTotal(),
          status: 'PENDING',
          supplier: { connect: { id: checkSupplier.id } },
          orderedBy: { connect: { id: ctx.session.user.id } },
          purchaseOrderDetails: {
            createMany: {
              data: input.products
            }
          }
        },
        include: {
          purchaseOrderDetails: true
        }
      });

      // await ctx.db.purchaseOrder.update({
      //   where: { id: order.id },
      //   data: {
      //     totalAmount: order.purchaseOrderDetails
      //       .map((product) => product.pricePerUnit * product.quantity)
      //       .reduce((a, b) => a + b, 0)
      //   }
      // });

      await ctx.db.product.updateMany({
        where: {
          id: {
            in: input.products.map((product) => product.productId)
          }
        },
        data: {
          quantityOnStock: {
            decrement: input.products
              .map((product) => product.quantity)
              .reduce((a, b) => a + b, 0)
          }
        }
      });

      await ctx.db.inventoryLog.createMany({
        data: input.products.map((product) => ({
          changeType: 'PURCHASE',
          quantityChange: product.quantity,
          productId: product.productId
        }))
      });

      return order;
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
      const data = await ctx.db.purchaseOrder.findMany({
        orderBy: { createdAt: 'desc' },
        include: { supplier: true },
        take: input.limit,
        skip: input.limit * (input.page - 1)
      });

      const total = await ctx.db.product.count();

      return { data, total };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.purchaseOrder.findUnique({
        where: { id: input.id },
        include: {
          supplier: true,
          purchaseOrderDetails: { include: { product: true } },
          orderedBy: true
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
