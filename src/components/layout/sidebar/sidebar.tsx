'use client';
import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import { navItems } from '@/constant/data';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="p-5 pt-10">
        <Link className="flex items-center overflow-hidden" href={'/'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-circle h-6 w-6 flex-none text-orange-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          <span className="ml-2 text-xl font-normal text-secondary-foreground">
            AGUULAH
          </span>
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
