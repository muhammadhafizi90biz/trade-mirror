import { Activity, CalendarDays, TrendingUp, UserRound } from "lucide-react";
import { getUserDashboardData } from "@/lib/dashboard/data";
import { TradeList } from "./components/trade-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, totals, latestTrades, totalTrades } = await getUserDashboardData();

  return (
    <div className="mx-auto max-w-7xl">
      <section className="rounded-lg border border-white/10 bg-slate-950/85 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400/10">
            <UserRound className="h-5 w-5 text-emerald-300" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              User Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-white">
              Welcome to TradeMirror
            </h1>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
          You are signed in as {user.email ?? user.id}. This is the default
          workspace for your journal, trade logging, and reflection workflow.
        </p>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Today Total Tick",
            value: totals.today.toLocaleString(),
            helper: "Based on today's trades in Kuala Lumpur time.",
            icon: Activity,
          },
          {
            label: "This Week Total Tick",
            value: totals.week.toLocaleString(),
            helper: "Monday to Sunday in Kuala Lumpur time.",
            icon: CalendarDays,
          },
          {
            label: "Total Overall Ticks",
            value: totals.overall.toLocaleString(),
            helper: `${totalTrades.toLocaleString()} trades logged overall.`,
            icon: TrendingUp,
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-lg border border-emerald-300/15 bg-slate-950/75 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-400">{card.label}</p>
                <Icon className="h-5 w-5 text-emerald-300" strokeWidth={1.8} />
              </div>
              <p className="mt-5 text-3xl font-semibold text-white">{card.value}</p>
              <p className="mt-2 text-sm text-slate-500">{card.helper}</p>
            </article>
          );
        })}
      </div>

      <TradeList trades={latestTrades} showViewAll={totalTrades > latestTrades.length} />
    </div>
  );
}
