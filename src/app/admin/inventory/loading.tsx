import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="m-8 flex flex-col space-y-3">
      {/* <Skeleton className="h-[225px] w-full rounded-xl" /> */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-4/5" />
      </div>
    </div>
  );
}
