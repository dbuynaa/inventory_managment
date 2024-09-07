import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

import { db } from '@/server/db';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { type UserRole } from '@prisma/client';
import { z } from 'zod';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      phoneNumber: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface CredentialsInputs {
    phoneNumber: string;
    password: string;
  }

  interface User {
    role: UserRole;
    phoneNumber: string;
    image?: string | null;
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string | null;
    role: UserRole;
    phoneNumber: string;
    image: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        phoneNumber: { label: 'Phone Number', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            phoneNumber: z.string().min(8),
            password: z.string().min(6)
          })
          .safeParse(credentials);

        if (!credentials?.phoneNumber || !credentials?.password) {
          return null;
        }

        if (parsedCredentials.success) {
          const { phoneNumber, password } = parsedCredentials.data;
          const user = await db.user.findFirst({
            where: {
              phoneNumber: phoneNumber
            }
          });
          if (!user) return null;

          const passwordsMatch = await compare(password, user.password);

          if (passwordsMatch)
            return {
              id: user.id,
              phoneNumber: user.phoneNumber,
              role: user.role,
              name: user.name,
              image: user.image
            };
        }

        console.log('Invalid credentials');
        return null;
      }
    })
  ],
  // adapter: PrismaAdapter(db) as Adapter,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl));
      }
      return true;
    },
    session({ session, token }) {
      // Add role to the session
      if (token.id) session.user.id = token.id;
      if (token.role) session.user.role = token.role;
      if (token.phoneNumber) session.user.phoneNumber = token.phoneNumber;
      if (token.image) session.user.image = token.image;

      return session;
    },
    jwt({ token, user }) {
      // Add role to the token
      if (user) token.role = user.role;
      if (user) token.phoneNumber = user.phoneNumber;
      if (user) token.id = user.id ?? null;
      if (user) token.name = user.name;
      if (user) token.image = user.image ?? null;

      // if (session) token.id = session;

      return token;
    }
  },

  pages: {
    error: '/',
    signIn: '/',
    signOut: '/'
  }
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions);
