import { contentRouter } from './routers/content';
import { networkRouter } from './routers/network';
import { profileRouter } from './routers/profile';
import { subscriptionRouter } from './routers/subscription';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  content: contentRouter,
  network: networkRouter,
  profile: profileRouter,
  subscription: subscriptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
