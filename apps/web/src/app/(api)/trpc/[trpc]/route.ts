import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth';

import { createTRPCContext } from '@openconductor/api';
import { appRouter } from '@openconductor/api';
import { authOptions } from '@openconductor/auth';

const handler = async (req: Request) => {
  const session = await getServerSession(authOptions);

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    // @ts-ignore
    createContext: async () => await createTRPCContext(session),
  });
};

export { handler as GET, handler as POST };
