import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const workflowRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workflow.findMany({
      orderBy: { id: 'desc' },
      include: {
        blocks: {
          include: {
            agent: true,
          },
        },
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
            agent: true,
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
  update: protectedProcedure.input(z.object({ id: z.string(), name: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.workflow.update({
      where: { id: input.id },
      data: { name: input.name },
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.workflow.delete({ where: { id: input } });
  }),
});
