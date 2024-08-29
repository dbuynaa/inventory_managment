'use client';

import { PageContainer } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columts';
import { api } from '@/trpc/react';
import { type Product } from '@prisma/client';

const breadcrumbItems = [{ title: 'Inventory', link: '/admin/inventory' }];

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const { data, error } = api.product.getLatest.useQuery();

  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <Breadcrumb items={breadcrumbItems} /> */}

        <div className="flex items-start justify-between">
          {/* <Heading
            title={`Total Products (${total})`}
            description="Manage employees (Server side table functionalities.)"
          /> */}

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
          data={(data as unknown as Product[]) ?? []}
        />
      </div>
    </PageContainer>
  );
}
