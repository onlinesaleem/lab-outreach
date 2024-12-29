import { AuthOptions, DefaultSession, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma/db";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) {
          console.log("Missing email or password");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            companyId: true,
            image: true, // Ensure this field is included
          },
        });

        if (!user) {
          console.log("User not found for email:", credentials.email);
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          console.log("Invalid password for user:", user.email);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          role: token.user.role,
          companyId: token.user.companyId,
          image: token.user.image || null,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: Number(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          image: user.image || null,
        };
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true,
};
