import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@openconductor/db';
import { type DefaultSession, type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      name: string | null | undefined;
      firstName: string | null | undefined;
      lastName: string | null | undefined;
      email: string | null | undefined;
      image: string | null | undefined;
    } & DefaultSession['user'];
  }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.name = user.name;
      session.user.firstName = user.name?.split(' ')[0];
      session.user.lastName = user.name?.split(' ')[1];
      session.user.email = user.email;
      session.user.image = user.image;
      return session;
    },
  },
  events: {
    async signIn(message) {
      if (message.isNewUser) {
        // Create a new Team for the user
        const team = await prisma.team.create({
          data: {
            name: 'Personal Space',
            creator: { connect: { id: message.user.id } },
          },
        });
        // Create a new TeamMembership for the user
        await prisma.teamMember.create({
          data: {
            team: { connect: { id: team.id } },
            user: { connect: { id: message.user.id } },
            isAdmin: true,
          },
        });
        // Create a new agent playground for the user
        await prisma.agent.create({
          data: {
            name: 'Playground',
            prompt: 'Show me an {keyword}',
            input: { keyword: 'example' },
            playground: true,
            conductor: true,
            team: { connect: { id: team.id } },
            creator: { connect: { id: message.user.id } },
          },
        });
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      authorization: {
        params: {
          /**
           * consent: The server should prompt the user for consent even if consent has already been granted for the requested scopes. This can be useful if you want the user to re-confirm their consent for certain actions.
           */
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid https://www.googleapis.com/auth/webmasters.readonly',
        },
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      version: '2.0',
      authorization: {
        params: {
          scope:
            'tweet.read tweet.write tweet.moderate.write users.read follows.read follows.write offline.access space.read mute.read mute.write like.read like.write list.read list.write block.read block.write bookmark.read bookmark.write',
        },
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
  pages: {
    signIn: '/login',
  },
};
