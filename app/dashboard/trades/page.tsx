import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getUserTradesPage, getUserAssets } from "@/lib/dashboard/data";
import type { TradeFilters } from "@/lib/dashboard/data";
import { TradeList } from "../components/trade-list";
import { TradeSearchForm } from "./trade-search-form";

export const dynamic = "force-dynamic";

function parseSearchParams(params: Awaited<ReturnType<typeof getRawParams>>) {
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Number.isInteger(Number(rawPage)) && Number(rawPage) > 0 ? Number(rawPage) : 1;

  const filters: TradeFilters = {};

  const rawAsset = Array.isArray(params.asset) ? params.asset[0] : params.asset;
  if (rawAsset) filters.asset = rawAsset;

  const rawPosition = Array.isArray(params.position) ? params.position[0] : params.position;
  if (rawPosition) filters.position = rawPosition;

  const rawDateFrom = Array.isArray(params.dateFrom) ? params.dateFrom[0] : params.dateFrom;
  if (rawDateFrom) filters.dateFrom = rawDateFrom;

  const rawDateTo = Array.isArray(params.dateTo) ? params.dateTo[0] : params.dateTo;
  if (rawDateTo) filters.dateTo = rawDateTo;

  const rawResult = Array.isArray(params.result) ? params.result[0] : params.result;
  if (rawResult) filters.result = rawResult;

  return { page, filters };
}

function buildFilterQuery(filters: TradeFilters): string {
  const params = new URLSearchParams();
  if (filters.asset) params.set("asset", filters.asset);
  if (filters.position) params.set("position", filters.position);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.result) params.set("result", filters.result);
  return params.toString();
}

function getRawParams(sp: Promise<{ [key: string]: string | string[] | undefined }>) {
  return sp;
}

export default async function TradesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const rawParams = await getRawParams(searchParams);
  const { page, filters } = parseSearchParams(rawParams);
  const [result, assets] = await Promise.all([
    getUserTradesPage(page, filters),
    getUserAssets(),
  ]);

  const { trades, totalTrades, totalPages } = result;
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;
  const filterQuery = buildFilterQuery(filters);
  const hasActiveFilters = Object.values(filters).some((v) => v);

  function paginationHref(newPage: number) {
    const qs = new URLSearchParams();
    qs.set("page", String(newPage));
    if (filters.asset) qs.set("asset", filters.asset);
    if (filters.position) qs.set("position", filters.position);
    if (filters.dateFrom) qs.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) qs.set("dateTo", filters.dateTo);
    if (filters.result) qs.set("result", filters.result);
    return `/dashboard/trades?${qs.toString()}`;
  }

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
          {hasActiveFilters
            ? `${totalTrades.toLocaleString()} trade${totalTrades === 1 ? "" : "s"} found.`
            : `Showing page ${page} of ${totalPages} across ${totalTrades.toLocaleString()} trades.`}
        </p>
      </div>

      <TradeSearchForm
        assets={assets}
        currentFilters={{
          asset: filters.asset ?? "",
          position: filters.position ?? "",
          dateFrom: filters.dateFrom ?? "",
          dateTo: filters.dateTo ?? "",
          result: filters.result ?? "",
        }}
      />

      <div className="mt-6">
        <TradeList trades={trades} />
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={hasPrevious ? paginationHref(page - 1) : "#"}
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
            href={hasNext ? paginationHref(page + 1) : "#"}
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
      )}
    </div>
  );
}
