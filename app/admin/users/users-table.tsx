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
import { ArrowUpDown, ShieldCheck, ShieldOff } from "lucide-react";
import { toggleAdmin } from "../actions";
import type { UserOverviewRow } from "@/lib/admin/data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

type UsersTableProps = {
  users: UserOverviewRow[];
  currentUserId: string;
  canManageAdmins: boolean;
};

export function UsersTable({
  users,
  currentUserId,
  canManageAdmins,
}: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<UserOverviewRow>[]>(
    () => [
      {
        accessorKey: "email",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-2 text-left"
          >
            User
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-white">
              {row.original.email ?? "No email on profile"}
            </p>
            <p className="mt-1 font-mono text-xs text-slate-500">{row.original.id}</p>
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-2 text-left"
          >
            Signup Date
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-slate-300">{formatDate(getValue<string>())}</span>
        ),
      },
      {
        accessorKey: "total_trades",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-2 text-left"
          >
            Total Trades
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="font-semibold text-amber-200">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "is_admin",
        header: "Admin",
        cell: ({ row }) => {
          const isAdmin = Boolean(row.original.is_admin);
          const isSuperAdmin = Boolean(row.original.is_super_admin);

          return (
            <span
              className={
                isAdmin
                  ? "inline-flex items-center gap-2 rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200"
                  : "inline-flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-slate-400"
              }
            >
              {isAdmin ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <ShieldOff className="h-3.5 w-3.5" />
              )}
              {isSuperAdmin ? "Super admin" : isAdmin ? "Admin" : "User"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const isSelf = row.original.id === currentUserId;
          const isSuperAdmin = Boolean(row.original.is_super_admin);
          const disabled = !canManageAdmins || isSelf || isSuperAdmin;

          if (!canManageAdmins) {
            return <span className="text-xs text-slate-500">Super admin only</span>;
          }

          return (
            <form action={toggleAdmin}>
              <input type="hidden" name="userId" value={row.original.id} />
              <button
                type="submit"
                disabled={disabled}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-amber-300/25 px-3 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-slate-600"
              >
                {row.original.is_admin ? "Remove Admin" : "Make Admin"}
              </button>
            </form>
          );
        },
      },
    ],
    [canManageAdmins, currentUserId],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="mt-6 rounded-lg border border-amber-300/15 bg-zinc-950/85">
      <div className="border-b border-amber-300/10 p-4">
        <input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Filter users by email, ID, or admin status"
          className="h-11 w-full rounded-lg border border-amber-300/20 bg-black px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
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
