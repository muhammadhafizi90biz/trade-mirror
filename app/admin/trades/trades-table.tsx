"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Trade } from "@/lib/supabase/types";

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function TradesTable({ trades }: { trades: Trade[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [userFilter, setUserFilter] = useState("");

  const columns = useMemo<ColumnDef<Trade>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Trade ID",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-slate-500">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "user_id",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-2 text-left"
          >
            User ID
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-slate-300">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "asset",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-2 text-left"
          >
            Asset
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="font-semibold text-white">
            {getValue<string | null>() ?? "Unknown"}
          </span>
        ),
      },
      {
        accessorKey: "ticks",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-2 text-left"
          >
            Ticks
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="font-semibold text-amber-200">
            {(getValue<number | null>() ?? 0).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "trade_time",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-2 text-left"
          >
            Trade Time
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-slate-300">{formatDateTime(getValue<string | null>())}</span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Logged",
        cell: ({ getValue }) => (
          <span className="text-slate-400">{formatDateTime(getValue<string>())}</span>
        ),
      },
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: trades,
    columns,
    state: {
      sorting,
      columnFilters: [{ id: "user_id", value: userFilter }],
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="mt-6 rounded-lg border border-amber-300/15 bg-zinc-950/85">
      <div className="border-b border-amber-300/10 p-4">
        <input
          value={userFilter}
          onChange={(event) => setUserFilter(event.target.value)}
          placeholder="Filter by user_id"
          className="h-11 w-full rounded-lg border border-amber-300/20 bg-black px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-amber-300/10 text-xs uppercase tracking-[0.12em] text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-amber-300/10">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-amber-300/[0.04]">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
