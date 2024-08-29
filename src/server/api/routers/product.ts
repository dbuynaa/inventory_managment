import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from '@/server/api/trpc';

export const productRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string(),
        categoryId: z.string(),
        supplierId: z.string(),
        price: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId, supplierId, ..._input } = input;
      return await ctx.db.product.create({
        data: {
          ..._input,
          supplier: { connect: { id: supplierId } },
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

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!';
  })
});
