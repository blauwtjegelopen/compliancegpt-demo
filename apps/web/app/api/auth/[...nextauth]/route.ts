// apps/web/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Ensure this runs on the Node runtime (Prisma isn't Edge-safe)
export const runtime = "nodejs";
// Avoid caching in dev
export const dynamic = "force-dynamic";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // ✅ Credentials requires JWT sessions
  session: { strategy: "jwt" },

  // Short-ish JWT lifetime; fine for a demo
  jwt: { maxAge: 60 * 60 * 24 * 7 }, // 7 days

  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        if (!email) return null;

        // ✅ Allow ALL emails (no domain restriction)
        // If you later want to restrict: check process.env.ALLOWED_SIGNUP_DOMAIN here.

        // Upsert to avoid unique race conditions
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: email.split("@")[0],
            memberships: {
              create: {
                role: "OWNER",
                org: { create: { name: `${email.split("@")[0]}'s Org` } },
              },
            },
          },
          include: { memberships: true },
        });

        // Whatever you return becomes the JWT basis
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.uid = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.uid) {
        (session.user as any).id = token.uid as string;
      }
      return session;
    },
  },

  // Helpful while setting up
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };