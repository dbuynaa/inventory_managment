import { PageContainer } from '@/components/layout';
import { api } from '@/trpc/server';

export const metadata = {
  title: 'Financial Reports',
  description: 'View financial reports and statements'
};

export default async function ReportPage() {
  const data = await api.report.getPurchaseOrderSummary();
  return (
    <PageContainer>
      <h1 className="mb-8 text-4xl font-bold">Financial Reports</h1>
      <div className="space-y-8">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Purchase Orders</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
              {data.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between rounded border p-4"
                >
                  <span>{item._count.id}</span>
                  <span>{item.status}</span>
                  <span>${item._sum.totalAmount?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
