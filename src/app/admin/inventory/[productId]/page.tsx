import type { Metadata } from 'next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/trpc/server';
import InventoryDetailsPage from './_components/productDetails';

type Props = {
  params: { productId: string };
  searchParams: Record<string, string | string[] | undefined>;
};
export async function generateMetadata(
  { params }: Props
  // parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.productId;

  // fetch data
  const product = await api.product.getById({ id });

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: product.name
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages]
    // }
  };
}
export default async function InventoryPage({ params, searchParams }: Props) {
  const product = await api.product.getById({ id: params.productId });

  if (!product) return null;

  return (
    <ScrollArea className="h-full">
      <InventoryDetailsPage searchParams={searchParams} product={product} />
    </ScrollArea>
  );
}
