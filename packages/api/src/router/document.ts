import { createTRPCRouter, protectedProcedure } from '../trpc';
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
});
