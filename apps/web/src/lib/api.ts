import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '@openconductor/api';

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from '@openconductor/api';
