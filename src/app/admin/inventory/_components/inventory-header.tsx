'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';
import ProductCreateModal from './product-create-modal';
import { useEffect, useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import useDebounce from '@/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';

export default function InventoryHeader() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') ?? ''
  );
  // const { setParam } = useSearch();
  const onSearch = useSearch();
  const debouncedSearchTerm = useDebounce(searchTerm || '', 500);

  useEffect(() => {
    onSearch('search', debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <div className="flex items-start justify-between">
      <Heading
        title={`Агуулахын удирдлага`}
        description="Агуулахын бүтээгдэхүүний жагсаалт"
      />
      <div className="flex space-x-4">
        <Input
          type="search"
          placeholder="Search products..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ProductCreateModal product={null}>
          <Button variant="default">
            <Package className="mr-2 h-4 w-4" /> Шинэ Бүтээгдэхүүн
          </Button>
        </ProductCreateModal>
      </div>
    </div>
  );
}
