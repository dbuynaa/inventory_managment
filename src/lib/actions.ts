'use server';

import { signIn } from '@/auth';
import {
  type productCreateInput,
  type adjustmentCreateInput,
  type supplierCreateInput,
  type customerCreateInput,
  type salesCreateInput
} from '@/server/api/types';
import { api } from '@/trpc/server';
import {
  type ProductStatus,
  type SalesStatus,
  type OrderStatus
} from '@prisma/client';

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

    revalidatePath('/admin/inventory');
    return {
      message: 'Product deleted successfully.',
      success: true
    };
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
export async function productStatusAction(
  id: string | undefined,
  status: ProductStatus
) {
  if (!id) {
    throw new Error('Sales not found.');
  }
  try {
    await api.product.status({ id: id, status: status });
    revalidatePath('/sales');
    return {
      message: `Status амжилттай солигдлоо.`,
      success: true
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      return {
        message: error.message,
        success: false
      };
    }
    return {
      message: 'Failed to delete sales.',
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
    revalidatePath('/admin/inventory');
    return {
      message: `Product created successfully.`,
      success: true
    };
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
    await api.inventory.productAdjustment(data);
    const path = `/admin/inventory`;

    revalidatePath(path);
    return {
      message: `Adjustemnt created successfully.`,
      success: true
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      return {
        message: error.message,
        success: false
      };
    }
    return {
      message: 'Database Error: Failed to create adjustment.',
      success: false
    };
  }
}

export async function customerCreateAction(
  data: z.infer<typeof customerCreateInput>
) {
  try {
    await api.customer.create(data);
    revalidatePath('/customer');
    return {
      message: `Customer created successfully.`,
      success: true
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      message: 'Database Error: Failed to create customer.',
      success: true
    };
  }
}

export async function customerDeleteAction(id: string | undefined) {
  if (!id) {
    throw new Error('Customer not found.');
  }
  try {
    await api.customer.delete({ id: id });
    revalidatePath('/customer');
  } catch (error) {
    if (error instanceof TRPCError) {
      return {
        message: error.message,
        success: false
      };
    }
    return {
      message: 'Failed to delete customer.',
      success: false
    };
  }
}

export async function customerUpdateAction(
  data: z.infer<typeof customerCreateInput>
) {
  try {
    await api.customer.update(data);
    revalidatePath('/customer');
    return {
      message: `Customer updated successfully.`,
      success: true
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      message: 'Database Error: Failed to update customer.',
      success: false
    };
  }
}

export async function salesCreateAction(
  data: z.infer<typeof salesCreateInput>
) {
  try {
    await api.sales.create(data);
    revalidatePath('/sales');
    return {
      message: `Sales created successfully.`,
      success: true
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      message: 'Database Error: Failed to create sales.',
      success: false
    };
  }
}

export async function salesDeleteAction(id: string | undefined) {
  if (!id) {
    throw new Error('Sales not found.');
  }
  try {
    await api.sales.delete({ id: id });
    revalidatePath('/sales');
    return {
      message: `Sales deleted successfully.`,
      success: true
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      return {
        message: error.message,
        success: false
      };
    }
    return {
      message: 'Failed to delete sales.',
      success: false
    };
  }
}

export async function salesStatusAction(
  id: string | undefined,
  status: SalesStatus
) {
  if (!id) {
    throw new Error('Sales not found.');
  }
  try {
    await api.sales.status({ id: id, status: status });
    revalidatePath('/sales');
    return {
      message: `Status амжилттай солигдлоо.`,
      success: true
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      return {
        message: error.message,
        success: false
      };
    }
    return {
      message: 'Failed to delete sales.',
      success: false
    };
  }
}

export async function salesUpdateAction(
  data: z.infer<typeof salesCreateInput>
) {
  try {
    await api.sales.update(data);
    revalidatePath('/sales');
    return {
      message: `Sales updated successfully.`,
      success: true
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      message: 'Database Error: Failed to update sales.',
      success: false
    };
  }
}

export async function orderStatusAction(orderId: string, status: OrderStatus) {
  try {
    await api.order.updateStatus({ id: orderId, status });
    revalidatePath('/admin/order');
    return { success: true, message: 'Order status updated successfully.' };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false, message: 'Failed to update order status.' };
  }
}
