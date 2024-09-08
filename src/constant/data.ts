import { type Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  description?: string;
}

export interface User {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
}

export const navItems: NavItem[] = [
  {
    title: 'Хяналтын самбар',
    href: '/admin',
    icon: 'dashboard'
  },
  {
    title: 'Нөөц',
    href: '/admin/inventory',
    icon: 'inventory'
  },
  {
    title: 'Худалдан авах захиалга',
    href: '/admin/order',
    icon: 'order'
  },
  {
    title: 'Ханган нийлүүлэгч',
    href: '/admin/supplier',
    icon: 'truck'
  },
  {
    title: 'Хэрэглэгч',
    href: '/admin/customer',
    icon: 'user'
  },
  {
    title: 'Худалдаа',
    href: '/admin/sales',
    icon: 'sales'
  },
  {
    title: 'Нөөцийн тэмдэглэл',
    href: '/admin/logs',
    icon: 'logs'
  }
];
