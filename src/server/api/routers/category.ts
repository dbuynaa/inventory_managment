import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const categoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return categories ?? null;
  })
});
