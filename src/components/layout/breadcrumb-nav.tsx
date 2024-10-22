'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import React from 'react';

export const BreadcrumbNav = ({ url }: { url: string }) => {
  const pathSegments = url.split('/').filter((segment) => segment);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = '/' + pathSegments.slice(0, index + 1).join('/');

          const label = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize the segment
          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label.replace(/-/g, ' ')}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label.replace(/-/g, ' ')}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
    // <Breadcrumb className="hidden md:flex">
    //   <BreadcrumbList>
    //     <BreadcrumbItem>
    //       <BreadcrumbLink asChild>
    //         <Link href="/">Home</Link>
    //       </BreadcrumbLink>
    //     </BreadcrumbItem>
    //     {breadcrumbItems.map((item, index) => (
    //       <React.Fragment key={index}>
    //         <BreadcrumbSeparator />
    //         <BreadcrumbItem>
    //           <BreadcrumbLink asChild>
    //             <Link href={item.href}>{item.label}</Link>
    //           </BreadcrumbLink>
    //         </BreadcrumbItem>
    //       </React.Fragment>
    //     ))}
    //   </BreadcrumbList>
    // </Breadcrumb>
  );
};
