import { SalesStatus } from '@prisma/client';
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
  expectedDeliveryDate: z
    .date()
    .min(new Date(), 'Expected delivery date is required'),
  // totalAmount: z.coerce.number({
  //   required_error: 'Total amount is required'
  // }),
  supplierId: z.string().min(1, 'Supplier is required'),

  products: z.array(
    z.object({
      totalPrice: z.coerce.number(),
      pricePerUnit: z.coerce.number({
        message: 'Price per unit is required',
        invalid_type_error: 'Price per unit is required',
        required_error: 'Price per unit is required'
      }),
      quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
      productId: z.string().min(1, 'Product is required')
    })
  )
});

export const salesCreateInput = z.object({
  id: z.string().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  status: z.nativeEnum(SalesStatus),
  customerId: z.string().min(1, 'Customer is required'),
  products: z.array(
    z.object({
      productId: z.string().min(1, 'Product is required'),
      pricePerUnit: z.coerce.number({
        message: 'Price per unit is required'
      }),
      quantitySold: z.coerce.number().min(1, 'Quantity must be at least 1'),
      totalPrice: z.coerce
        .number()
        .positive({ message: 'Total must be a positive number.' })
    })
  )
});

export const customerCreateInput = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number.' }),
  address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters.' })
});
