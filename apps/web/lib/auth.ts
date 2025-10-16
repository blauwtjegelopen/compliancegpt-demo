// apps/web/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const allowedDomain = process.env.ALLOWED_SIGNUP_DOMAIN?.toLowerCase();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Email only",
      credentials: {
        email: { label: "Work email", type: "email", placeholder: "you@company.com" },
      },
      async authorize(credentials) {
        const email = (credentials?.email || "").toLowerCase().trim();
        if (!email || !email.includes("@")) return null;

        // Optional: allow only one domain (e.g. mycompany.com)
        if (allowedDomain && !email.endsWith(`@${allowedDomain}`)) {
          throw new Error(`Only ${allowedDomain} emails are allowed`);
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, name: email.split("@")[0] },
          });
        }
        return user;
      },
    }),
    // Add OAuth providers later (Google, GitHub) by appending to this array.
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) (session.user as any).id = user.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};