import { createTRPCRouter, protectedProcedure } from '../trpc';
import { taskQueue } from '@openconductor/config-temporal';
import { connectToTemporal } from '@openconductor/config-temporal/temporal-client';
import { AiAgentType } from '@openconductor/db';
import { createAiAgent } from '@openconductor/workflows';
import { z } from 'zod';

export const aiAgentRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.aiAgent.findMany({
      orderBy: { name: 'asc' },
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
    return ctx.prisma.aiAgent.findFirst({
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
      return temporal.workflow.start(createAiAgent, {
        workflowId: `${input.type}-executor-${new Date()}`,
        args: [
          {
            type: input.type as AiAgentType,
            url: input.url,
            userId: ctx.session?.user.id,
            teamId: input.teamId,
          },
        ],
        taskQueue,
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.aiAgent.delete({ where: { id: input } });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        enabled: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aiAgent.update({
        where: { id: input.id },
        data: { enabled: input.enabled },
      });
    }),
});
