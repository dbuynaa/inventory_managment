import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSKU(category: string, supplierName: string) {
  const categoryInitials = category.slice(0, 3).toUpperCase(); // Take first 3 letters of the category
  const supplierInitials = supplierName.slice(0, 3).toUpperCase();
  const randomString = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${categoryInitials}-${supplierInitials}-${randomString}`;
}

export function generateReferenceId(
  quantityChange: number,
  changeType: string
): string {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const uniqueSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${changeType.slice(0, 3).toUpperCase()}${Math.abs(quantityChange)}-${timestamp.slice(0, 8)}-${uniqueSuffix}`;
}
