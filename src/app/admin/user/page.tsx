import { PageContainer } from '@/components/layout';
// import { users } from '@/constants/data';

const breadcrumbItems = [{ title: 'User', link: '/user' }];
export default function page() {
  return (
    <PageContainer>
      <div className="space-y-2">
        {/* <Breadcrumbs items={breadcrumbItems} />
        <UserClient data={users} /> */}
      </div>
    </PageContainer>
  );
}
