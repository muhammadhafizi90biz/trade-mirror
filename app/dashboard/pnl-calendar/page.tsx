import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { getUserPnlCalendarData } from "@/lib/dashboard/data";

export const dynamic = "force-dynamic";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMonthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-MY", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function parseMonth(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const match = rawValue?.match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    };
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
  };
}

function getDayParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function dayTone(pnl: number, tradeCount: number) {
  if (tradeCount === 0) {
    return "border-slate-800 bg-slate-950/70 text-slate-500";
  }

  if (pnl > 0) {
    return "border-emerald-400/25 bg-emerald-400/12 text-emerald-50";
  }

  if (pnl < 0) {
    return "border-rose-400/25 bg-rose-400/12 text-rose-50";
  }

  return "border-slate-600/40 bg-slate-700/25 text-slate-100";
}

function monthOptions(year: number) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const value = `${year}-${String(month).padStart(2, "0")}`;
    const label = formatMonthLabel(year, month);

    return { value, label };
  });
}

export default async function PnlCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string | string[]; day?: string | string[] }>;
}) {
  const params = await searchParams;
  const selectedMonth = parseMonth(params.month);
  const data = await getUserPnlCalendarData({
    year: selectedMonth.year,
    month: selectedMonth.month,
    selectedDay: getDayParam(params.day),
  });

  const cards = [
    {
      label: "Total P&L",
      value: formatCurrency(data.summary.totalPnl),
      icon: CircleDollarSign,
    },
    {
      label: "Winning Days",
      value: data.summary.winningDays.toLocaleString(),
      icon: TrendingUp,
    },
    {
      label: "Losing Days",
      value: data.summary.losingDays.toLocaleString(),
      icon: TrendingDown,
    },
    {
      label: "Win Rate",
      value: `${data.summary.winRate.toFixed(0)}%`,
      icon: Target,
    },
    {
      label: "Total Trades",
      value: data.summary.totalTrades.toLocaleString(),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-5 border-b border-emerald-300/15 pb-6 xl:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Performance Calendar
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
            P&L Calendar
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-300">
            {formatMonthLabel(data.year, data.month)}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/dashboard/pnl-calendar?month=${data.previousMonthValue}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-300/25 px-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              Previous
            </Link>

            <form action="/dashboard/pnl-calendar" className="flex items-center gap-2">
              <select
                name="month"
                defaultValue={data.monthValue}
                className="h-10 rounded-lg border border-emerald-300/20 bg-black px-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
              >
                {monthOptions(data.year).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-10 rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                Go
              </button>
            </form>

            <Link
              href={`/dashboard/pnl-calendar?month=${data.nextMonthValue}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-300/25 px-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
            >
              Next
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                className="min-w-32 rounded-lg border border-emerald-300/15 bg-slate-950/75 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                    {card.label}
                  </p>
                  <Icon className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
                </div>
                <p className="mt-3 text-xl font-semibold text-white">{card.value}</p>
              </article>
            );
          })}
        </div>
      </div>

      <section className="mt-6 rounded-lg border border-emerald-300/15 bg-slate-950/75 p-4">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {weekdayLabels.map((weekday) => (
            <div key={weekday} className="py-2">
              {weekday}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {Array.from({ length: data.firstDayOffset }).map((_, index) => (
            <div key={`blank-${index}`} className="min-h-28 rounded-lg border border-transparent" />
          ))}

          {data.days.map((day) => (
            <Link
              key={day.dateKey}
              href={`/dashboard/pnl-calendar?month=${data.monthValue}&day=${day.dateKey}`}
              className={`min-h-28 rounded-lg border p-3 transition hover:scale-[1.01] hover:border-emerald-300/50 ${dayTone(day.pnl, day.tradeCount)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold">{day.dayNumber}</span>
                {day.tradeCount > 0 ? (
                  <span className="rounded-full bg-black/25 px-2 py-1 text-[11px] font-semibold">
                    {day.tradeCount}
                  </span>
                ) : null}
              </div>
              <div className="mt-5">
                <p className="text-sm font-bold">{formatCurrency(day.pnl)}</p>
                <p className="mt-1 text-xs opacity-70">
                  {day.tradeCount > 0 ? `${day.tradeCount} trades` : "No trades"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-emerald-300/15 bg-slate-950/75 p-5">
        <h2 className="text-lg font-semibold text-white">
          {data.selectedDay
            ? `Trading Day: ${data.selectedDay.dateKey}`
            : "Select a trading day"}
        </h2>
        {data.selectedDay ? (
          <div className="mt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-emerald-300/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Net P&L</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {formatCurrency(data.selectedDay.pnl)}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-300/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Trades</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {data.selectedDay.tradeCount}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-300/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Avg P&L</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {formatCurrency(
                    data.selectedDay.tradeCount > 0
                      ? data.selectedDay.pnl / data.selectedDay.tradeCount
                      : 0,
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 divide-y divide-emerald-300/10">
              {data.selectedDay.trades.length > 0 ? (
                data.selectedDay.trades.map((trade) => (
                  <Link
                    key={trade.id}
                    href={`/dashboard/trades/${trade.id}`}
                    className="grid gap-2 py-4 text-sm transition hover:bg-emerald-300/[0.04] sm:grid-cols-[1fr_auto_auto]"
                  >
                    <span className="font-semibold text-white">{trade.asset ?? "Unknown"}</span>
                    <span className="text-slate-400">
                      {(trade.ticks ?? 0).toLocaleString()} ticks
                    </span>
                    <span className="font-semibold text-emerald-200">
                      {formatCurrency(trade.pnl)}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="py-4 text-sm text-slate-500">
                  No trades were logged on this day.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Click a day in the calendar to view daily trade statistics.
          </p>
        )}
      </section>
    </div>
  );
}
