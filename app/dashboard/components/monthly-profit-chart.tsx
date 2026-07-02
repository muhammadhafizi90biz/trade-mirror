"use client";

import { TrendingUp } from "lucide-react";
import type { MonthlyProfit } from "@/lib/dashboard/data";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function niceRound(value: number, up: boolean): number {
  const abs = Math.abs(value);
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(abs, 1))));
  const normalized = abs / magnitude;
  let rounded: number;
  if (up) {
    if (normalized <= 1) rounded = 1;
    else if (normalized <= 2) rounded = 2;
    else if (normalized <= 5) rounded = 5;
    else rounded = 10;
  } else {
    if (normalized >= 10) rounded = 10;
    else if (normalized >= 5) rounded = 5;
    else if (normalized >= 2) rounded = 2;
    else rounded = 1;
  }
  return rounded * magnitude;
}

export function MonthlyProfitChart({ data }: { data: MonthlyProfit[] }) {
  if (data.length === 0) {
    return null;
  }

  const maxVal = Math.max(...data.map((d) => d.pnl), 0);
  const minVal = Math.min(...data.map((d) => d.pnl), 0);
  const maxAbs = Math.max(Math.abs(maxVal), Math.abs(minVal), 1);

  const niceMax = niceRound(maxVal || maxAbs, true);
  const niceMin = minVal < 0 ? -niceRound(Math.abs(minVal) || maxAbs, true) : 0;
  const range = niceMax - niceMin;
  const steps = 5;
  const stepSize = range / steps;

  const ticks: number[] = [];
  for (let i = 0; i <= steps; i++) {
    ticks.push(niceMin + stepSize * i);
  }

  const totalPnl = data.reduce((s, m) => s + m.pnl, 0);
  const profitable = data.filter((m) => m.pnl > 0).length;
  const losing = data.filter((m) => m.pnl < 0).length;
  const chartHeight = 260;

  return (
    <section className="rounded-lg border border-emerald-300/15 bg-slate-950/75 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10">
          <TrendingUp className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Monthly Profit / Loss
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Last 12 months</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div className="flex w-14 flex-col justify-between text-right">
          {[...ticks].reverse().map((tick) => (
            <span
              key={tick}
              className="text-[10px] font-medium leading-none text-slate-500"
            >
              {tick === 0 ? "$0" : formatCurrency(tick)}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="relative flex flex-1 gap-2">
          {/* Grid lines */}
          {ticks.map((tick) => {
            const pct = range > 0 ? ((tick - niceMin) / range) * 100 : 0;
            return (
              <div
                key={tick}
                className={`absolute left-0 right-0 ${
                  tick === 0
                    ? "border-t border-slate-400/50"
                    : "border-t border-slate-800/60"
                }`}
                style={{ bottom: `${pct}%` }}
              />
            );
          })}

          {/* Bars */}
          {data.map((month) => {
            const isPositive = month.pnl >= 0;
            const barPct = range > 0 ? (Math.abs(month.pnl) / range) * 100 : 0;
            const zeroPct = range > 0 ? (-niceMin / range) * 100 : 50;
            const clampedPct = Math.max(barPct, 0.5);

            return (
              <div
                key={month.monthKey}
                className="group relative flex flex-1 flex-col items-center"
              >
                {isPositive ? (
                  <div
                    className="absolute w-[80%] rounded-t-sm bg-emerald-400 transition-all group-hover:opacity-80"
                    style={{ bottom: `${zeroPct}%`, height: `${clampedPct}%` }}
                  />
                ) : (
                  <div
                    className="absolute w-[80%] rounded-b-sm bg-rose-400 transition-all group-hover:opacity-80"
                    style={{ top: `${100 - zeroPct}%`, height: `${clampedPct}%` }}
                  />
                )}

                <span
                  className={`absolute z-10 rounded bg-slate-900 px-1.5 py-0.5 text-[11px] font-semibold opacity-0 transition-opacity group-hover:opacity-100 ${
                    isPositive
                      ? "bottom-[calc(50%+6px)] text-emerald-300"
                      : "top-[calc(50%+6px)] text-rose-300"
                  }`}
                >
                  {formatCurrency(month.pnl)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month labels */}
      <div className="mt-1 flex gap-3">
        <div className="w-14 shrink-0" />
        <div className="flex flex-1 gap-2">
          {data.map((month) => (
            <span
              key={month.monthKey}
              className="flex-1 text-center text-[10px] font-medium text-slate-500"
            >
              {month.label.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-emerald-300/10 pt-3 text-xs text-slate-500">
        <span>Total: {formatCurrency(totalPnl)}</span>
        <span>
          {profitable} profitable / {losing} losing months
        </span>
      </div>
    </section>
  );
}
