import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PageContainer({
  children,
  scrollable = false
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-60px)]">
          <div className="h-full p-4 md:px-4">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full">{children}</div>
      )}
    </>
  );
}
