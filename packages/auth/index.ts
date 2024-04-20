import { authOptions } from './src/auth-options';
import NextAuth from 'next-auth';

export const handlers = NextAuth(authOptions);
export { authOptions } from './src/auth-options';
export { getServerSession } from './src/get-session';
export type { Session } from 'next-auth';
