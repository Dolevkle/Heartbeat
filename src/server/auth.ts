import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  type Account,
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import SpotifyProvider from "next-auth/providers/spotify";

import { env } from "~/env";
import { db } from "~/server/db";
import { type JWT } from "next-auth/jwt";
import { AUTH_URL } from "~/lib/spotify";
import SpotifyProfile, {
  refreshAccessToken,
} from "~/app/api/auth/[...nextauth]/SpotifyProfile";
// import {type JWT} from "next-auth/jwt";
// import spotifyApi from "~/app/_lib/spotify";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      spotifyId: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token, user }) {
      const account = (await db.account.findFirst({
        where: { userId: user.id },
      })) as Account;
      session.user = {
        ...session.user,
        access_token: account.access_token!,
        token_type: account.token_type,
        expires_at: account.expires_at,
        refresh_token: account.refresh_token,
        scope: account.scope,
        id: user.id,
        spotifyId: account.providerAccountId,
      };
      return session;
    },
  },
  // session: { strategy: "jwt" },
  adapter: PrismaAdapter(db) as Adapter,
  secret: env.NEXTAUTH_SECRET,

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
