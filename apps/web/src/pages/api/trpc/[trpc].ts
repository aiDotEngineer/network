import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter, createTRPCContext } from '@pkg/api';

import { env } from '~/env.mjs';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
          );
        }
      : undefined,
});
