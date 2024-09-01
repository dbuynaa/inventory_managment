import { Header, PageContainer, Sidebar } from '@/components/layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Basic admin with Next.js and Shadcn'
};

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden bg-muted/30">
        <Header />
        <PageContainer scrollable>{children}</PageContainer>
      </main>
    </div>
  );
}
