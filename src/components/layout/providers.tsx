'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider, type SessionProviderProps } from 'next-auth/react';

export function Providers({
  children,
  session
}: {
  session: SessionProviderProps['session'];
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}
