import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  type Account,
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";

import { env } from "~/env";
import { db } from "~/server/db";
import SpotifyProfile from "~/app/api/auth/[...nextauth]/SpotifyProfile";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  // TODO might need to change type
  interface Session extends DefaultSession {
    user: {
      // ...other properties
      // role: UserRole;
      id: string;
      access_token?: string;
      token_type?: string;
      expires_at?: number;
      refresh_token?: string;
      scope?: string;
    } & User;
  }

  interface User {
    // ...other properties
    // role: UserRole;
    spotifyId: string;
    profileImage: string | null | undefined;
    age?: number;
    gender?: string;
    sexualPreference?: string;
    personality?: {
      Openness: string;
      Neuroticism: string;
      Extraversion: string;
      Conscientiousness: string;
      Agreeableness: string;
    };
  }
}
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      const account = (await db.account.findFirst({
        where: { userId: user.id },
      })) as Account;
      session.user = {
        ...session.user,
        access_token: account.access_token,
        token_type: account.token_type,
        expires_at: account.expires_at,
        refresh_token: account.refresh_token,
        scope: account.scope,
        id: user.id,
        spotifyId: account.providerAccountId,
        profileImage: user?.image,
        personality: user?.personality,
        age: user?.age,
        gender: user?.gender,
        sexualPreference: user?.sexualPreference,
      };
      return session;
    },
  },
  // session: { strategy: "jwt" },
  adapter: PrismaAdapter(db) as Adapter,
  secret: env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    SpotifyProfile,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
