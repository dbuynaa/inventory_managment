import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';

export default function InventoryHeader({
  total,
  setProductDialogOpen
}: {
  total: number;
  setProductDialogOpen: (open: boolean) => void;
}) {
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
        <Button
          variant="default"
          onClick={() => setProductDialogOpen(true)}
          // className="w-full"
        >
          <Package className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
    </div>
  );
}
