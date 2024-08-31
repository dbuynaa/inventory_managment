// 'use client';

import { PageContainer } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { columns } from './_components/columts';
import { api } from '@/trpc/server';
import { Heading } from '@/components/ui/heading';
import { DataTable } from '@/components/form/data-table';

// const breadcrumbItems = [{ title: 'Inventory', link: '/admin/inventory' }];

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;
  const data = await api.product.getMany({
    limit: pageLimit,
    page: page
  });
  const total = data.total;

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

        <DataTable
          columns={columns}
          data={data.products ?? []}
          page={page}
          limit={pageLimit}
          totalProducts={total}
        />
      </div>
    </PageContainer>
  );
}
