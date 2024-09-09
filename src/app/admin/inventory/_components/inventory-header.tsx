'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';
import ProductCreateModal from './product-create-modal';
import { useEffect, useState } from 'react';
import { useSearch } from '@/hooks/useSearch';

export default function InventoryHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const { setParam } = useSearch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debounce = (fn: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        fn(...args);
      }, delay);
    };
  };
  useEffect(() => {
    debounce(() => {
      setParam('search', searchTerm);
    }, 300);
  }, [searchTerm, setParam]);
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
