import { connectToTemporal } from '@openconductor/config-temporal/temporal-client';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { taskQueue } from '@openconductor/config-temporal/temporal-connection';
import { refreshMessages } from '@openconductor/workflows/messages/refreshMessages';

export const messageRouter = createTRPCRouter({
  all: protectedProcedure.input(z.object({})).query(({ ctx, input }) => {
    return ctx.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        team: {
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
    });
  }),
  byId: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.message.findFirst({
      where: { id: input.id },
    });
  }),
  refresh: protectedProcedure.input(z.object({ teamId: z.string() })).mutation(async ({ input, ctx }) => {
    const temporal = await connectToTemporal();
    return temporal.workflow.execute(refreshMessages, {
      workflowId: `${new Date()}-refreshMessages`,
      args: [{ userId: ctx.session?.user.id, teamId: input.teamId }],
      taskQueue,
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.message.delete({ where: { id: input } });
  }),
});
