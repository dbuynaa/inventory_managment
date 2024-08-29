import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductForm } from '@/components/forms/product-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CategoriesDocument,
  CategoriesQuery,
  Product,
  ProductDocument,
  ProductQuery
} from '@/graphql/generated';

export default async function InventoryPage({
  params
}: {
  params: { productId: string };
}) {
  const { productId } = params;

  console.log('productId', productId);
  const breadcrumbItems = [
    { title: 'Inventory', link: '/admin/inventory' },
    { title: productId ? 'Update' : 'Create', link: '/product/create' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ProductForm
          categories={categories.categories || []}
          initialData={(data.product as Product) || null}
          key={productId}
        />
      </div>
    </ScrollArea>
  );
}
