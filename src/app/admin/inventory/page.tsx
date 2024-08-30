// 'use client';

import { PageContainer } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columts';
import { api } from '@/trpc/server';
import { Heading } from '@/components/ui/heading';

// const breadcrumbItems = [{ title: 'Inventory', link: '/admin/inventory' }];

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const data = await api.product.getAll();
  const total = data.length;

  // if (error) {
  //   return <div className="text-red-500">{error.message}</div>;
  // }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}

        <div className="flex items-start justify-between">
          <Heading
            title={`Total Products (${total})`}
            description="Manage employees (Server side table functionalities.)"
          />

          <Link
            href={'/admin/inventory/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        {/* <DataTable columns={columns} data={products || []} searchKey="name" /> */}

        <DataTable
          columns={columns}
          data={data ?? []}
          offset={pageLimit}
          totalProducts={total}
        />
      </div>
    </PageContainer>
  );
}
