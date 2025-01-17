'use client';

import { DataTable } from '@/components/form/data-table';
import { PageContainer } from '@/components/layout';
import { Separator } from '@/components/ui/separator';
import { columns } from './columts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import SupplierForm from './supplierForm';
import { type Supplier } from '@prisma/client';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
  data: Supplier[];
  total: number;
}

export default function SupplierContainer({
  searchParams,
  data,
  total
}: paramsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;

  const handleEditClick = ({ supplier }: { supplier: Supplier }) => {
    setSelectedSupplier(supplier);
    setOpen(true);
  };
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="mb-6 flex items-center justify-between">
          <Input
            type="search"
            placeholder="Нийлүүлэгчийг хайх..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Шинэ нийлүүлэгч нэмэх
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Шинэ нийлүүлэгч нэмэх</DialogTitle>
              </DialogHeader>
              <SupplierForm
                initialData={
                  selectedSupplier
                    ? {
                        id: selectedSupplier.id,
                        name: selectedSupplier.name,
                        phoneNumber: selectedSupplier.phoneNumber,
                        email: selectedSupplier.email ?? undefined
                      }
                    : undefined
                }
                onSuccess={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Separator />

        {!data ? (
          <p>Мэдээлэл байхгүй</p>
        ) : (
          <DataTable
            columns={columns(handleEditClick)}
            data={data ?? []}
            // isLoading={}
            page={page}
            limit={pageLimit}
            total={total}
          />
        )}
      </div>
    </PageContainer>
  );
}
