import { createTRPCRouter, protectedProcedure } from '../trpc';
import { Integrations } from '@openconductor/db/types';
import { z } from 'zod';

export const integrationRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.integration.findMany({
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
  activeIntegration: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.integration.findFirst({
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
    return ctx.prisma.integration.findFirst({
      where: { id: input.id },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(Integrations),
        teamId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.integration.create({
        data: {
          type: input.type,
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
    .input(z.object({ id: z.string(), type: z.nativeEnum(Integrations) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.integration.update({
        where: { id: input.id },
        data: { type: input.type },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.integration.delete({ where: { id: input } });
  }),
});
