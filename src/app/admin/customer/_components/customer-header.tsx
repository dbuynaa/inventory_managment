import { Input } from '@/components/ui/input';
import CustomerCreateModal from './customer-create-modal';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerHeader() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Input
        type="text"
        placeholder="Search customers..."
        //   value={searchTerm}
        //   onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <CustomerCreateModal>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </CustomerCreateModal>
    </div>
  );
}
