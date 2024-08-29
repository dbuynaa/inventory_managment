import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { columns, InventoryTable } from '@/components/tables/inventory-tables';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Product, ProductsDocument, ProductsQuery } from '@/graphql/generated';
import { getClient } from '@/lib/apollo/ApolloClientRSC';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const breadcrumbItems = [{ title: 'Inventory', link: '/admin/inventory' }];

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  //   const country = searchParams.search || null;
  //   const offset = (page - 1) * pageLimit;
  const { data, error } = await getClient().query<ProductsQuery>({
    query: ProductsDocument,
    variables: {
      take: pageLimit,
      skip: pageLimit,
      where: {
        search: searchParams.search,
        filter: {
          date: searchParams.date,
        },
        orderBy: searchParams.order,
      },
    },
  });
  const products = data?.products?.data;
  const total = data?.products?.count || 0;
  const pageCount = Math.ceil(total / pageLimit);

  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

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

        <InventoryTable
          searchKey="country"
          pageNo={page}
          columns={columns as Product[]}
          totalUsers={total}
          data={products || []}
          searchParams={searchParams}
          pageCount={pageCount}
        />
      </div>
    </PageContainer>
  );
}
