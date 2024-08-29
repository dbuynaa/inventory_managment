import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, {
  type DefaultSession
  // type NextAuthOptions
} from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import type { NextAuthConfig } from 'next-auth';

// import { env } from '@/env';
import { db } from '@/server/db';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { type UserRole } from '@prisma/client';
import { z } from 'zod';
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

// declare module 'next-auth' {
//   type UserSession = DefaultSession['user'];
//   interface Session {
//     user: UserSession;
//   }

//   interface CredentialsInputs {
//     email: string;
//     password: string;
//   }
// }
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
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
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions = {
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
    }

    // session({ session, user }) {
    //   if (session.user) {
    //     session.user.id = user.id;
    //     session.user.role = user.role;
    //     session.user.phoneNumber = user.phoneNumber;
    //     session.user.name = user.name;
    //   }
    //   return session;
    // },
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = user.role;
    //     token.phoneNumber = user.phoneNumber;
    //     token.name = user.name;
    //   }
    //   return token;
    // }
  },

  // adapter: PrismaAdapter(db) as Adapter,
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

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch)
            return {
              phoneNumber: user.phoneNumber,
              role: user.role,
              name: user.name,
              id: user.id,
              image: user.image
            };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/'
    // signOut: '/'
  }
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions);
