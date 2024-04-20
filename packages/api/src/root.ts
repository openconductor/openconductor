import { authRouter } from './router/auth';
import { blockRouter } from './router/block';
import { documentRouter } from './router/document';
import { eventRouter } from './router/event';

import { pluginRouter } from './router/plugin';
import { runRouter } from './router/run';
import { teamRouter } from './router/team';
import { agentRouter } from './router/agent';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  agent: agentRouter,
  auth: authRouter,
  block: blockRouter,
  document: documentRouter,
  event: eventRouter,
  plugin: pluginRouter,
  run: runRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
