import NextAuth from 'next-auth';
import { authOptions } from './auth';

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/');
    return Response.redirect(url);
  }
});

export const config = { matcher: ['/admin/:path*'] };
