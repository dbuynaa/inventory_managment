'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Search } from '@/components/search';

export default function InventoryHeader() {
  return (
    <div className="flex items-start justify-between">
      <Heading
        title={`Агуулахын удирдлага`}
        description="Агуулахын бүтээгдэхүүний жагсаалт"
      />
      <div className="flex space-x-4">
        <Search />
        <Link href="/admin/inventory/new">
          <Button>
            <Package className="mr-2 h-4 w-4" /> Бүтээгдэхүүн нэмэх
          </Button>
        </Link>
        {/* <ProductCreateModal product={null}>
      <Button variant="default">
        <Package className="mr-2 h-4 w-4" /> Шинэ Бүтээгдэхүүн
      </Button>
    </ProductCreateModal> */}
      </div>
    </div>
  );
}
