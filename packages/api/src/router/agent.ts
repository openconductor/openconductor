import { updateAgentSchema } from '../schema/agent';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { Agents } from '@openconductor/db/types';
import { z } from 'zod';

export const agentRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.agent.findMany({
      orderBy: { id: 'desc' },
      include: {
        blocks: true,
        integration: true,
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
        type: z.nativeEnum(Agents),
        teamId: z.string(),
        integrationId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.agent.create({
        data: {
          name: input.name || 'Untitled agent',
          type: input.type || 'TRANSFORM',
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
  update: protectedProcedure.input(updateAgentSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.agent.update({
      where: { id: input.id },
      data: {
        name: input.name,
        type: input.type,
        integrationId: input.integrationId,
        systemTemplate: input.systemTemplate,
        promptTemplate: input.promptTemplate,
      },
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.agent.delete({ where: { id: input } });
  }),
});
