// src/app/admin/order/_components/orders-table-loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderDataTableLoading() {
  return (
    <div className="m-8 flex flex-col space-y-3">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
}
