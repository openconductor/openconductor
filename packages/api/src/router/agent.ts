import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const agentRouter = createTRPCRouter({
  all: protectedProcedure.input(z.object({ conductor: z.boolean().optional() })).query(({ ctx, input }) => {
    return ctx.prisma.agent.findMany({
      orderBy: { id: 'desc' },
      include: {
        blocks: true,
        runs: true,
      },
      where: {
        conductor: input.conductor,
        playground: false,
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
  byId: protectedProcedure
    .input(z.object({ id: z.string(), conductor: z.boolean().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.agent.findFirst({
        where: { id: input.id, conductor: input.conductor },
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
          runs: {
            orderBy: {
              startedAt: 'desc',
            },
          },
        },
      });
    }),
  playground: protectedProcedure.input(z.object({ conductor: z.boolean().optional() })).query(({ ctx, input }) => {
    return ctx.prisma.agent.findFirst({
      where: {
        playground: true,
        conductor: input.conductor,
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
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        teamId: z.string(),
        prompt: z.string().optional(),
        input: z.record(z.string(), z.any()).optional(),
        conductor: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.agent.create({
        data: {
          playground: false,
          conductor: input.conductor,
          name: input.name,
          prompt: input.prompt,
          input: input.input || {},
          team: {
            connect: { id: input.teamId },
          },
          creator: {
            connect: { id: ctx.session?.user.id },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        prompt: z.string().optional(),
        input: z.record(z.string(), z.any()).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.agent.update({
        where: { id: input.id },
        data: { name: input.name, prompt: input.prompt, input: input.input },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.agent.delete({ where: { id: input } });
  }),
});
