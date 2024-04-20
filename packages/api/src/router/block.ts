import { updateBlockSchema } from '../schema/block';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const blockRouter = createTRPCRouter({
  byId: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.prisma.block.findFirst({
      where: { id: input },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        prevOrder: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Rearrange the order of the blocks
      const [_, newBlock] = await ctx.prisma.$transaction([
        ctx.prisma.block.updateMany({
          where: {
            workflowId: input.workflowId,
            order: {
              gte: input.prevOrder,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        }),
        ctx.prisma.block.create({
          data: {
            name: 'New block',
            input: 'Add input',
            order: input.prevOrder + 1,
            workflow: {
              connect: {
                id: input.workflowId,
              },
            },
            creator: {
              connect: {
                id: ctx.session?.user.id,
              },
            },
          },
        }),
      ]);

      return newBlock;
    }),
  update: protectedProcedure.input(updateBlockSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.block.update({
      where: { id: input.blockId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.input && { input: input.input }),
        ...(input.order && { order: input.order }),
      },
    });
  }),
  moveUp: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    const block = await ctx.prisma.block.findFirstOrThrow({
      where: { id: input },
    });

    // Given a block, change its order to be one less than its current order
    // Make sure to change the order of the block before it to be one more than its current order
    const [_, newBlock] = await ctx.prisma.$transaction([
      ctx.prisma.block.updateMany({
        where: {
          workflowId: block.workflowId,
          order: {
            gte: block.order - 1,
            lte: block.order,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      }),
      ctx.prisma.block.update({
        where: { id: input },
        data: {
          order: block.order - 1,
        },
      }),
    ]);

    return newBlock;
  }),
  moveDown: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    const block = await ctx.prisma.block.findFirstOrThrow({
      where: { id: input },
    });

    // Given a block, change its order to be one more than its current order
    // Make sure to change the order of the block after it to be one less than its current order
    const [_, newBlock] = await ctx.prisma.$transaction([
      ctx.prisma.block.updateMany({
        where: {
          workflowId: block.workflowId,
          order: {
            gte: block.order,
            lte: block.order + 1,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      }),
      ctx.prisma.block.update({
        where: { id: input },
        data: {
          order: block.order + 1,
        },
      }),
    ]);

    return newBlock;
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.block.delete({ where: { id: input } });
  }),
});
