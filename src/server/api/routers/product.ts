import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from '@/server/api/trpc';

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string(),
        quantity: z.number(),
        price: z.number(),
        categoryId: z.string(),
        supplierId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId, supplierId, ..._input } = input;
      console.log('userId ===?', ctx.session.user);
      return await ctx.db.product.create({
        data: {
          ..._input,
          // supplier: { connect: { id: supplierId } },
          category: { connect: { id: categoryId } },
          createdBy: { connect: { id: ctx.session.user.id } }
        }
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const product = await ctx.db.product.findFirst({
      orderBy: { createdAt: 'desc' }
      // where: { createdBy: { id: ctx.session.user.id } }
    });

    return product ?? null;
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
