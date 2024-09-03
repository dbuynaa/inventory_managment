import { Modal } from '@/components/ui/modal';
import { ProductForm } from './product-form';
import { type Product } from '@prisma/client';

export default function ProductCreateModal({
  isOpen,
  product,
  onClose
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      title="Create Product"
      description="Create a new product"
      isOpen={isOpen}
      onClose={onClose}
      className="md:max-w-3xl"
    >
      <ProductForm onComplete={onClose} initialData={product} />
    </Modal>
  );
}
