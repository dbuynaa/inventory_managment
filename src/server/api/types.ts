import { z } from 'zod';
export const loginSchema = z.object({
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});

export const productCreateInput = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' }),
  description: z
    .string()
    .min(3, { message: 'Product description must be at least 3 characters' }),
  price: z.coerce.number(),
  costPrice: z.coerce.number(),
  quantityOnStock: z.coerce.number(),
  reorderLevel: z.coerce.number(),
  categoryId: z.string().min(1, { message: 'Please select a category' }),
  supplierId: z.string().min(1, { message: 'Please select a supplier' })
});

export const supplierCreateInput = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
  email: z.string().email('Invalid email address').optional()
});

export const adjustmentCreateInput = z.object({
  productId: z.string(),
  quantityAdjusted: z.coerce.number(),
  reason: z.string()
  // adjustmentType: z.enum(AdjustmentType.ADJUSTED, )
});

export const orderCreateInput = z.object({
  expectedDeliveryDate: z.date({
    required_error: 'Expected delivery date is required'
  }),
  totalAmount: z.coerce.number({
    required_error: 'Total amount is required'
  }),
  supplierId: z.string().min(1, 'Supplier is required'),

  orderDetails: z.array(
    z.object({
      totalPrice: z.coerce.number(),
      pricePerUnit: z.coerce.number(),
      quantityOrdered: z.coerce.number(),
      productId: z.string()
    })
  )
});
