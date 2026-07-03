"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";

const positionOptions = [
  { value: "", label: "All" },
  { value: "long", label: "Long" },
  { value: "short", label: "Short" },
];

const resultOptions = [
  { value: "", label: "All" },
  { value: "profit", label: "Profit" },
  { value: "loss", label: "Loss" },
];

export function TradeSearchForm({
  assets,
  currentFilters,
}: {
  assets: { code: string; name: string }[];
  currentFilters: {
    asset: string;
    position: string;
    dateFrom: string;
    dateTo: string;
    result: string;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function buildQueryString(data: Record<string, FormDataEntryValue>) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        params.set(key, String(value));
      }
    }
    return params.toString();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    const qs = buildQueryString(data);
    router.push(qs ? `/dashboard/trades?${qs}` : "/dashboard/trades");
  }

  function handleClear() {
    router.push("/dashboard/trades");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-lg border border-emerald-300/15 bg-slate-950/75 p-4"
    >
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-300">
          Search Trades
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Asset</label>
          <select
            name="asset"
            defaultValue={currentFilters.asset}
            className="h-9 w-full rounded-lg border border-emerald-300/20 bg-black px-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
          >
            <option value="">All Assets</option>
            {assets.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Position</label>
          <select
            name="position"
            defaultValue={currentFilters.position}
            className="h-9 w-full rounded-lg border border-emerald-300/20 bg-black px-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
          >
            {positionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Date From</label>
          <input
            type="date"
            name="dateFrom"
            defaultValue={currentFilters.dateFrom}
            className="h-9 w-full rounded-lg border border-emerald-300/20 bg-black px-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Date To</label>
          <input
            type="date"
            name="dateTo"
            defaultValue={currentFilters.dateTo}
            className="h-9 w-full rounded-lg border border-emerald-300/20 bg-black px-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Result</label>
          <select
            name="result"
            defaultValue={currentFilters.result}
            className="h-9 w-full rounded-lg border border-emerald-300/20 bg-black px-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
          >
            {resultOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
        >
          <Filter className="h-3.5 w-3.5" strokeWidth={2} />
          Apply
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-300/25 px-3 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.8} />
          Clear
        </button>
      </div>
    </form>
  );
}
