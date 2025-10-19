// lib/auth/options.ts
import type { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// If you use OAuth providers, keep them here.
// These are optional stubs that only activate if env vars exist.
// Remove providers you don’t use, or add your own.
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
          }),
        ]
      : []),
  ],

  // keep/extend callbacks as your app needs
  callbacks: {
    async session({ session, token }) {
      if (token?.email && session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};