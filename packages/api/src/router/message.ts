import { connectToTemporal } from '@openconductor/config-temporal/temporal-client';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { taskQueue } from '@openconductor/config-temporal/temporal-connection';
import { refreshMessages } from '@openconductor/workflows/messages/refreshMessages';
import { MessageType } from '@openconductor/db';

export const messageRouter = createTRPCRouter({
  all: protectedProcedure.input(z.object({ type: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        type: {
          equals: input.type as MessageType,
        },
        state: {
          not: 'CLOSED',
        },
        team: {
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        parentId: null,
      },
      include: {
        author: true,
      },
    });
  }),
  byId: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.message.findFirst({
      where: { id: input.id },
      include: {
        children: true,
      },
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
