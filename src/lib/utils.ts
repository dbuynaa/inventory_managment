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
