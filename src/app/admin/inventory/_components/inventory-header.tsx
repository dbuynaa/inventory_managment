import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';
import ProductCreateModal from './product-create-modal';

export default function InventoryHeader({ total }: { total: number }) {
  return (
    <div className="flex items-start justify-between">
      <Heading
        title={`Total Products (${total})`}
        description="Manage your products and their inventory"
      />
      <div className="flex space-x-4">
        <Input
          type="search"
          placeholder="Search products..."
          className="max-w-sm"
          //   value={searchTerm}
          //   onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ProductCreateModal product={null}>
          <Button variant="default">
            <Package className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </ProductCreateModal>
      </div>
    </div>
  );
}
