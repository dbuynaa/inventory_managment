'use server';

import { signIn } from '@/auth';
import {
  productCreateInput,
  type adjustmentCreateInput,
  type supplierCreateInput
} from '@/server/api/types';
import { api } from '@/trpc/server';
import { TRPCError } from '@trpc/server';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { type z } from 'zod';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function createOrUpdateSupplier(
  formData: z.infer<typeof supplierCreateInput>
) {
  const { id, ...supplierData } = formData;
  try {
    if (id) {
      await api.supplier.update(formData);
    } else {
      await api.supplier.create(supplierData);
    }
    revalidatePath('/supplier');
    return {
      message: `Supplier ${id ? 'updated' : 'created'} successfully.`,
      success: true
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      message: `Supplier ${id ? 'updated' : 'created'} successfully.`,
      success: true
    };
    // return 'Database Error: Failed to create/update supplier.';
  }
}
export async function deleteSupplier(id: string | undefined) {
  if (!id) {
    throw new Error('Supplier not found.');
  }
  try {
    await api.supplier.delete({ id: id });
    revalidatePath('/supplier');
  } catch (error) {
    if (error instanceof TRPCError) {
      return {
        message: error.message,
        success: false
      };
    }
    return {
      message: 'Failed to delete supplier.',
      success: false
    };
  }
}
export async function deleteProduct(id: string | undefined) {
  if (!id) {
    throw new Error('Supplier not found.');
  }
  try {
    await api.product.delete({ id: id });
    revalidatePath('/inventory');
  } catch (error) {
    if (error instanceof TRPCError) {
      return {
        message: error.message,
        success: false
      };
    }
    return {
      message: 'Failed to delete supplier.',
      success: false
    };
  }
}

export async function createProductOrUpdateAction(
  data: z.infer<typeof productCreateInput>
) {
  try {
    if (data.id) {
      await api.product.update(data);
    } else {
      await api.product.create(data);
    }
    revalidatePath('/inventory');
    return {
      message: `Product created successfully.`,
      success: true
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    if (error instanceof TRPCError)
      return {
        message: error.message,
        success: false
      };

    return {
      message: 'Database Error: Failed to create/update product.',
      success: false
    };
  }
}

export async function adjustmentCreateAction(
  data: z.infer<typeof adjustmentCreateInput>
) {
  try {
    await api.product.productAdjustment(data);
    revalidatePath('/supplier');
    return {
      message: `Adjustemnt created successfully.`,
      success: true
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      message: `Adjustemnt created successfully.`,
      success: true
    };
  }
}
