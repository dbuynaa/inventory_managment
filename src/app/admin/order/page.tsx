import { OrderCards } from './_components/order-cards';
import { OrderDetails } from './_components/order-details';
import { OrderDataTable } from './_components/orders-table';

export const metadata = {
  title: 'Order Page',
  description:
    'An orders dashboard with a sidebar navigation. The sidebar has icon navigation.'
};
interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}
export default function OrderPage({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;
  const orderId = searchParams.id ?? undefined;
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 ">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <OrderCards />
          <OrderDataTable page={page} limit={pageLimit} />
        </div>
        <div>{orderId && <OrderDetails orderId={orderId as string} />}</div>
      </main>
    </div>
  );
}
