import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const workflowRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workflow.findMany({
      orderBy: { id: 'desc' },
      include: {
        blocks: true,
        runs: true,
      },
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
    return ctx.prisma.workflow.findFirst({
      where: { id: input.id },
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
          },
          include: {
            events: {
              orderBy: { startedAt: 'asc' },
            },
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
  create: protectedProcedure.input(z.object({ name: z.string(), teamId: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.workflow.create({
      data: {
        name: input.name || 'Untitled workflow',
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
      return ctx.prisma.workflow.update({
        where: { id: input.id },
        data: { name: input.name, prompt: input.prompt, input: input.input },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.workflow.delete({ where: { id: input } });
  }),
});
