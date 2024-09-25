import { columns } from './columts';
import { DataTable } from '@/components/form/data-table';
import { api } from '@/trpc/server';
interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function InventoryContainer({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;

  const data = await api.product.getMany({
    search: searchParams.search as string,
    limit: pageLimit,
    page: page
  });
  // const { data, isLoading } = api.product.getMany.useQuery(
  //   {
  //     search: searchParams.search as string,
  //     limit: pageLimit,
  //     page: page
  //   },
  //   {
  //     trpc: { ssr: false }
  //   }
  // );

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.products ?? []}
        page={page}
        limit={pageLimit}
        total={data?.total ?? 0}
        // isLoading={isLoading}
      />
    </>
  );
}
