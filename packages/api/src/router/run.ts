import { createTRPCRouter, protectedProcedure } from '../trpc';
import { taskQueue } from '@openconductor/config-temporal';
import { runAgent } from '@openconductor/workflows';
import { z } from 'zod';

export const runRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.run.findMany({
      orderBy: { id: 'desc' },
      include: {
        agent: true,
      },
      where: {
        agent: {
          team: {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      },
    });
  }),
  activeRun: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.run.findFirst({
      where: {
        agent: {
          team: {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      },
    });
  }),
  byId: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.run.findFirst({
      where: { id: input.id },
      include: {
        agent: true,
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ agentId: z.string(), prompt: z.string(), input: z.record(z.string(), z.any()) }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.temporal.workflow.start(runAgent, {
        workflowId: `${input.agentId}-executor-${new Date()}`,
        args: [{ agentId: input.agentId, prompt: input.prompt, input: input.input, userId: ctx.session?.user.id }],
        taskQueue,
      });
    }),
  update: protectedProcedure.input(z.object({ id: z.string(), status: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.run.update({
      where: { id: input.id },
      data: { status: input.status },
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.run.delete({ where: { id: input } });
  }),
});
