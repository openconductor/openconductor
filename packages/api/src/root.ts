import { agentRouter } from './router/agent';
import { authRouter } from './router/auth';
import { blockRouter } from './router/block';
import { eventRouter } from './router/event';
import { integrationRouter } from './router/integration';
import { runRouter } from './router/run';
import { teamRouter } from './router/team';
import { workflowRouter } from './router/workflow';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  team: teamRouter,
  integration: integrationRouter,
  agent: agentRouter,
  workflow: workflowRouter,
  block: blockRouter,
  run: runRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
