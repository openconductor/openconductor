'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { labels, priorities, statuses } from '../examples/tasks/data/data';
import { Message } from './schema';
import { DataTableColumnHeader } from '../examples/tasks/components/data-table-column-header';
import { DataTableRowActions } from '../examples/tasks/components/data-table-row-actions';
import Image from 'next/image';
import { SparklesIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
export const columns: ColumnDef<Message>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'key',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('key')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'author.handle',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
    cell: ({ row }) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={row.original.author.imageUrl}
            alt={row.original.author.handle}
            width={20}
            height={20}
            className="h-5 w-5 rounded-full mr-2"
          />
          {row.original.author.handle}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return (
        <div>
          <p>{row.original.title}</p>
          <p className="flex text-xs text-blue-600 items-center">
            <SparklesIcon className="h-2 w-2 mr-1" aria-hidden="true" /> {row.original.summary}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue('status'));

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'labels',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Labels" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.labels.map((label, index) => (
            <div key={index}>
              <div className="flex p-1 border border-gray-700 rounded-lg text-xs items-center">
                <div
                  className={`inline-block h-2 w-2 rounded-full mr-1`}
                  style={{ backgroundColor: `#${label.color ? label.color.toLowerCase() : '000'}` }}
                ></div>
                <span>{label.name}</span>
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = priorities.find((priority) => priority.value === row.getValue('priority'));

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
