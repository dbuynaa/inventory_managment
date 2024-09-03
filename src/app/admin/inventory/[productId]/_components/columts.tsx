'use client';

import { type InventoryLog } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<InventoryLog>[] = [
  {
    accessorKey: 'changedAt',
    header: 'Date',
    accessorFn: (row) => new Date(row.changedAt).toLocaleDateString()
  },
  {
    accessorKey: 'quantityChange',
    header: 'Change',
    cell: ({ row }) => {
      return (
        <span
          className={
            row.original.quantityChange > 0 ? 'text-green-600' : 'text-red-600'
          }
        >
          {row.original.quantityChange > 0 ? '+' : ''}
          {row.original.quantityChange}
        </span>
      );
    }
  },
  {
    accessorKey: 'changeType',
    header: 'Type'
  },
  {
    accessorKey: 'referenceId',
    header: 'Reference'
  }
];
