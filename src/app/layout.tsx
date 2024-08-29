import '@/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import NextTopLoader from 'nextjs-toploader';

import { Providers } from '@/components/layout';
import { TRPCReactProvider } from '@/trpc/react';
import { auth } from '@/server/auth';

export const metadata: Metadata = {
  title: 'Create T3 App',
  description: 'Generated by create-t3-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Providers session={session}>
            <NextTopLoader showSpinner={false} />
            <Toaster />
            {children}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
