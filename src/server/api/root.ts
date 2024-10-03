import {
  productRouter,
  categoryRouter,
  supplierRouter,
  inventoryRouter,
  orderRouter,
  salesRouter,
  customerRouter,
  imageRouter,
  reportsRouter,
  dashboardRouter
} from '@/server/api/routers';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  supplier: supplierRouter,
  inventory: inventoryRouter,
  order: orderRouter,
  sales: salesRouter,
  customer: customerRouter,
  dashboard: dashboardRouter,
  image: imageRouter,
  report: reportsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
