'use client';

import { type Product } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// type Product =ProductType  {

// } ;

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity'
  }
];
