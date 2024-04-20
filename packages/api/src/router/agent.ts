import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const agentRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.agent.findMany({
      orderBy: { id: 'desc' },
      include: {
        blocks: true,
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
  activeAgent: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.agent.findFirst({
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
    return ctx.prisma.agent.findFirst({
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
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        teamId: z.string(),
        integrationId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.agent.create({
        data: {
          name: input.name || 'Untitled agent',
          type: 'TRANSFORM',
          isPublic: true,
          integration: {
            connect: { id: input.integrationId },
          },
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
    return ctx.prisma.agent.update({
      where: { id: input.id },
      data: { name: input.name },
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.agent.delete({ where: { id: input } });
  }),
});
