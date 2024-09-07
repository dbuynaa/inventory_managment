'use client';

import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from '../sidebar/mobile-sidebar';
import { UserNav } from '../user-nav';
import { BreadcrumbNav } from '../breadcrumb-nav';
import { usePathname } from 'next/navigation';

export function Header() {
  const url = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 py-2 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className={cn('block lg:!hidden')}>
        <MobileSidebar />
      </div>
      <div className="flex w-full justify-between gap-2">
        <BreadcrumbNav url={url} />
        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
