import { createTRPCRouter, protectedProcedure } from '../trpc';
import { taskQueue } from '@openconductor/config-temporal';
import { connectToTemporal } from '@openconductor/config-temporal/temporal-client';
import { SourceType } from '@openconductor/db';
import { createSource } from '@openconductor/workflows';
import { z } from 'zod';

export const sourceRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.source.findMany({
      orderBy: { id: 'desc' },
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
    return ctx.prisma.source.findFirst({
      where: { id: input.id },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        url: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const temporal = await connectToTemporal();
      return temporal.workflow.start(createSource, {
        workflowId: `${input.type}-executor-${new Date()}`,
        args: [
          {
            type: input.type as SourceType,
            url: input.url,
            userId: ctx.session?.user.id,
            teamId: input.teamId,
          },
        ],
        taskQueue,
      });
    }),
});
