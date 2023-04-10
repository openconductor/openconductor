import { createTRPCRouter, protectedProcedure } from '../trpc';
import { taskQueue } from '@openconductor/config-temporal';
import { test } from '@openconductor/workflows';
import { z } from 'zod';

export const runRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.run.findMany({
      orderBy: { id: 'desc' },
      include: {
        workflow: true,
      },
      where: {
        workflow: {
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
        workflow: {
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
        workflow: true,
      },
    });
  }),
  create: protectedProcedure.input(z.object({ workflowId: z.string() })).mutation(async ({ input, ctx }) => {
    return await ctx.temporal.workflow.start(test, {
      workflowId: `${input.workflowId}-createRun-${new Date()}`,
      args: [{ workflowId: input.workflowId, userId: ctx.session?.user.id }],
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
