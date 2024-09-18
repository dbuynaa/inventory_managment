import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { productCreateInput } from '../types';
import { TRPCError } from '@trpc/server';
import { generateSKU } from '@/lib/utils';

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(productCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { categoryId, supplierId, ..._input } = input;

      const checkCategory = await ctx.db.category.findUnique({
        where: { id: categoryId }
      });

      if (!checkCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found'
        });
      }

      const checkSupplier = await ctx.db.supplier.findUnique({
        where: { id: supplierId }
      });

      if (!checkSupplier) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Supplier not found'
        });
      }

      const sku = generateSKU(checkCategory.name, checkSupplier.name);
      return await ctx.db.product.create({
        data: {
          ..._input,
          sku: sku,
          supplier: { connect: { id: checkSupplier.id } },
          category: { connect: { id: checkCategory.id } },
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
      return await ctx.db.product.update({
        where: { id: input.id },
        data: {
          status: 'DELETED',
          updatedAt: new Date()
        }
      });
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        page: z.number(),
        search: z.string().optional(),
        supplierId: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          supplierId: input.supplierId,
          status: { not: 'DELETED' },
          name: { contains: input.search }
        },
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
