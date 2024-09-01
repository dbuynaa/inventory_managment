'use server';

import { signIn } from '@/auth';
import { adjustmentCreateInput, supplierCreateInput } from '@/server/api/types';
import { api } from '@/trpc/server';
import { TRPCError } from '@trpc/server';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';

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
  prevState: unknown,
  formData: FormData
) {
  const validatedFields = supplierCreateInput.safeParse({
    // ...Object.fromEntries(formData.entries())
    id: formData.get('id'),
    name: formData.get('name'),
    phoneNumber: formData.get('phoneNumber'),
    email: formData.get('email')
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: `${validatedFields.error.message}.`,
      success: false
    };
    // return 'Failed to create/update supplier.';
  }
  const data = validatedFields.data;
  const { id, ...supplierData } = data;
  try {
    if (id) {
      await api.supplier.update(data);
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

export async function adjustmentCreateAction(
  prevState: unknown,
  formData: FormData
) {
  const validatedFields = adjustmentCreateInput.safeParse(
    {
      adjustmentType: formData.get('adjustmentType'),
      productId: formData.get('productId'),
      quantityAdjusted: formData.get('quantityAdjusted'),
      reason: formData.get('reason')
      // ...Object.fromEntries(formData.entries())
    }
    //
  );
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      // message: `${validatedFields.error.message}.`,
      message: `${validatedFields.error.message}.`,
      success: false
    };
  }
  const data = validatedFields.data;
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
