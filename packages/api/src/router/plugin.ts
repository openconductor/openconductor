import { createTRPCRouter, protectedProcedure } from '../trpc';
import { Plugins } from '@openconductor/db/types';
import { z } from 'zod';

export const pluginRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.plugin.findMany({
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
  activePlugin: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.plugin.findFirst({
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
    return ctx.prisma.plugin.findFirst({
      where: { id: input.id },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(Plugins),
        teamId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.plugin.create({
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
    .input(z.object({ id: z.string(), type: z.nativeEnum(Plugins) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.plugin.update({
        where: { id: input.id },
        data: { type: input.type },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.plugin.delete({ where: { id: input } });
  }),
});
