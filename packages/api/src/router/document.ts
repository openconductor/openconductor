import { createTRPCRouter, protectedProcedure } from '../trpc';
import { taskQueue } from '@openconductor/config-temporal';
import { connectToTemporal } from '@openconductor/config-temporal/temporal-client';
import { embedGithub } from '@openconductor/workflows';
import { z } from 'zod';

export const documentRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.document.findMany({
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
    return ctx.prisma.document.findFirst({
      where: { id: input.id },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        repoUrl: z.string(),
        branch: z.string(),
        recursive: z.boolean().optional(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const temporal = await connectToTemporal();
      return temporal.workflow.start(embedGithub, {
        workflowId: `${input.repoUrl}-executor-${new Date()}`,
        args: [
          {
            repoUrl: input.repoUrl,
            branch: input.branch,
            recursive: input.recursive,
            userId: ctx.session?.user.id,
            teamId: input.teamId,
          },
        ],
        taskQueue,
      });
    }),
});
