import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';
import Link from 'next/link';

export default function InventoryHeader({ total }: { total: number }) {
  // const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="flex items-start justify-between">
      <Heading
        title={`Total Products (${total})`}
        // description="Manage employees (Server side table functionalities.)"
      />
      <div className="flex space-x-4">
        <Input
          type="search"
          placeholder="Search products..."
          className="max-w-sm"
          //   value={searchTerm}
          //   onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          href={'/admin/inventory/new'}
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <Package className="mr-2 h-4 w-4" /> Add New Product
        </Link>
      </div>
    </div>
  );
}
