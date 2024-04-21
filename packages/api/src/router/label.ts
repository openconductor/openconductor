import { connectToTemporal } from '@openconductor/config-temporal/temporal-client';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { taskQueue } from '@openconductor/config-temporal/temporal-connection';
import { assignIssue } from '@openconductor/workflows/ai/assignIssue';
import { aiAugmentMessage, aiRecommendMessages, embedSimilarMessages } from '@openconductor/workflows';

export const labelRouter = createTRPCRouter({
    assign: protectedProcedure.input(z.object({ owner: z.string(), repo: z.string(), issueId: z.string() })).mutation(async ({ input, ctx }) => {
        const temporal = await connectToTemporal();
        return temporal.workflow.execute(assignIssue, {
            workflowId: `${new Date()}-assignLabel`,
            args: [{ userId: ctx.session?.user.id, repo: input.repo, owner: input.owner, issueId: input.issueId }],
            taskQueue,
        });
    }),

    ai: protectedProcedure.input(z.object({ messageId: z.string() })).mutation(async ({ input, ctx }) => {
        const temporal = await connectToTemporal();
        return temporal.workflow.execute(aiAugmentMessage, {
            workflowId: `${new Date()}-aiAugmentMessage`,
            args: [{ messageId: input.messageId }],
            taskQueue,
        });
    }),
    similar: protectedProcedure.input(z.object({ messageId: z.string() })).query(async ({ input, ctx }) => {
        const temporal = await connectToTemporal();
        return temporal.workflow.execute(embedSimilarMessages, {
            workflowId: `${new Date()}-embedSimilarMessages`,
            args: [{ userId: ctx.session?.user.id, messageId: input.messageId }],
            taskQueue,
        });
    }),
    recommend: protectedProcedure.input(z.object({ teamId: z.string() })).mutation(async ({ input, ctx }) => {
        const temporal = await connectToTemporal();
        return temporal.workflow.execute(aiRecommendMessages, {
            workflowId: `${new Date()}-aiRecommendMessages`,
            args: [{ userId: ctx.session?.user.id, teamId: input.teamId }],
            taskQueue,
        });
    }),
});
