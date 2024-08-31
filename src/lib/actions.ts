'use server';

import { signIn } from '@/auth';
import { supplierCreateInput } from '@/server/api/types';
import { api } from '@/trpc/server';
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
    ...Object.fromEntries(formData.entries())
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create/update supplier.',
      success: false
    };
    // return 'Failed to create/update supplier.';
  }
  const data = validatedFields.data;
  const { id, ...supplierData } = data;
  try {
    if (id) {
      await api.supplier.update(supplierData);
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
  // const id = formData.get('id');
  if (!id) {
    return {
      message: 'Failed to delete supplier.',
      success: false
    };
  }
  try {
    await api.supplier.delete({ id: id });
    revalidatePath('/supplier');
    return {
      message: 'Supplier deleted successfully.',
      success: true
    };
  } catch (error) {
    return {
      message: 'Failed to delete supplier.',
      success: false
    };
  }
}
