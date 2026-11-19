import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { TradeListItem } from "@/lib/dashboard/data";

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-SG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

function formatPrice(value: number | null) {
  if (value === null) {
    return "-";
  }

  return value.toLocaleString("en-SG", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function tickClass(ticks: number | null) {
  if ((ticks ?? 0) > 0) {
    return "text-emerald-300";
  }

  if ((ticks ?? 0) < 0) {
    return "text-rose-300";
  }

  return "text-slate-300";
}

function positionClass(position: string | null) {
  if (position === "short") {
    return "bg-rose-400/10 text-rose-200";
  }

  if (position === "long") {
    return "bg-emerald-300/10 text-emerald-200";
  }

  return "bg-slate-700/40 text-slate-300";
}

export function TradeList({
  trades,
  showViewAll,
}: {
  trades: TradeListItem[];
  showViewAll?: boolean;
}) {
  return (
    <section className="mt-6 rounded-lg border border-emerald-300/15 bg-slate-950/75">
      <div className="flex flex-col gap-3 border-b border-emerald-300/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Latest Trades</h2>
          <p className="mt-1 text-sm text-slate-500">Most recent trades logged.</p>
        </div>
        {showViewAll ? (
          <Link
            href="/dashboard/trades"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-300/25 px-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
          >
            View All
          </Link>
        ) : null}
      </div>

      {trades.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-emerald-300/10 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Asset</th>
                <th className="px-4 py-3 font-semibold">Position</th>
                <th className="px-4 py-3 font-semibold">Contracts</th>
                <th className="px-4 py-3 font-semibold">Entry</th>
                <th className="px-4 py-3 font-semibold">Exit</th>
                <th className="px-4 py-3 font-semibold">Ticks</th>
                <th className="px-4 py-3 font-semibold">Logged</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-300/10">
              {trades.map((trade) => (
                <tr key={trade.id} className="transition hover:bg-emerald-300/[0.04]">
                  <td className="px-4 py-4 font-semibold text-white">
                    {trade.asset ?? "Unknown"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${positionClass(trade.position)}`}
                    >
                      {trade.position ?? "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-300">
                    {(trade.contracts ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    <span className="block font-medium">{formatPrice(trade.entry_price)}</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {formatDateTime(trade.entry_datetime)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    <span className="block font-medium">{formatPrice(trade.exit_price)}</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {formatDateTime(trade.exit_datetime)}
                    </span>
                  </td>
                  <td className={`px-4 py-4 text-lg font-semibold ${tickClass(trade.ticks)}`}>
                    {(trade.ticks ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    {formatDateTime(trade.created_at)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/dashboard/trades/${trade.id}`}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-300/25 px-3 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-5 text-sm text-slate-500">
          No trades logged yet. Add your first trade to start tracking.
        </div>
      )}
    </section>
  );
}
