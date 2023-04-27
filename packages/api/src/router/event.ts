import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const eventRouter = createTRPCRouter({
  all: protectedProcedure.input(z.object({ blockId: z.string().optional() })).query(({ ctx, input }) => {
    return ctx.prisma.event.findMany({
      orderBy: { id: 'desc' },
      include: {
        block: true,
      },
      where: {
        block: {
          id: input.blockId,
          workflow: {
            team: {
              members: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          },
        },
      },
    });
  }),
  activeEvent: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findFirst({
      where: {
        block: {
          workflow: {
            team: {
              members: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          },
        },
      },
    });
  }),
  byId: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.event.findFirst({
      where: { id: input.id },
      include: {
        block: true,
      },
    });
  }),
  update: protectedProcedure.input(z.object({ id: z.string(), status: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.event.update({
      where: { id: input.id },
      data: { status: input.status },
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.event.delete({ where: { id: input } });
  }),
});
