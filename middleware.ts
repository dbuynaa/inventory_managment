import NextAuth from 'next-auth';
import { authOptions } from './src/server/auth';

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/admin');
    return Response.redirect(url);
  }
});

export const config = { matcher: ['/admin/:path*'] };
// import NextAuth from 'next-auth';
// import { authOptions } from './src/server/auth';

// export default NextAuth(authOptions).auth;

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
// };
