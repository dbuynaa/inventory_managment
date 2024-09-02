import { Modal } from '@/components/ui/modal';
import { ProductForm } from './product-form';

export default function ProductCreateModal({
  isOpen,
  onClose
}: {
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
      <ProductForm onComplete={onClose} initialData={null} />
    </Modal>
  );
}
