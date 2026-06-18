import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getUserTradesPage } from "@/lib/dashboard/data";
import { TradeList } from "../components/trade-list";

export const dynamic = "force-dynamic";

function getPageValue(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number(rawValue ?? "1");

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function TradesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = getPageValue(params.page);
  const { trades, totalTrades, totalPages } = await getUserTradesPage(page);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="border-b border-emerald-300/15 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Trade History
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
          Logged Trades
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Showing page {page} of {totalPages} across {totalTrades.toLocaleString()} trades.
        </p>
      </div>

      <TradeList trades={trades} />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={hasPrevious ? `/dashboard/trades?page=${page - 1}` : "#"}
          aria-disabled={!hasPrevious}
          className={
            hasPrevious
              ? "inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-300/25 px-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
              : "inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-lg border border-slate-800 px-4 text-sm font-semibold text-slate-600"
          }
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
          Previous
        </Link>

        <span className="text-sm text-slate-500">
          Page {page} / {totalPages}
        </span>

        <Link
          href={hasNext ? `/dashboard/trades?page=${page + 1}` : "#"}
          aria-disabled={!hasNext}
          className={
            hasNext
              ? "inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-300/25 px-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
              : "inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-lg border border-slate-800 px-4 text-sm font-semibold text-slate-600"
          }
        >
          Next
          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      </div>
    </div>
  );
}
