import { DataTable } from '@/components/form/data-table';
import { PageContainer } from '@/components/layout';
import { Separator } from '@/components/ui/separator';
import { columns } from './_components/columts';
import { api } from '@/trpc/server';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { HeaderSupplier } from './_components/header';
// import { users } from '@/constants/data';

const breadcrumbItems = [{ title: 'Supplier', link: '/supplier' }];

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;
  const data = await api.supplier.getMany({
    limit: pageLimit,
    page: page
  });
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}

        <HeaderSupplier />
        <Separator />

        <DataTable
          columns={columns}
          data={data.supplier ?? []}
          page={page}
          limit={pageLimit}
          totalProducts={data.total}
        />
      </div>
    </PageContainer>
  );
}
