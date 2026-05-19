import { Activity, Clock3, Gem, TrendingUp } from "lucide-react";
import { getAdminHomeData } from "@/lib/admin/data";

export default async function AdminDashboardPage() {
  const { cards, activeHours, popularAssets, session } = await getAdminHomeData();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 border-b border-amber-300/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Platform Command
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-5xl">
            Admin Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Live operating metrics across TradeMirror users, trades, content, and broadcasts.
          </p>
        </div>
        <div className="rounded-lg border border-amber-300/15 bg-amber-300/[0.07] px-4 py-3 text-sm text-amber-100">
          Signed in as {session.profile.email ?? session.profile.id}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = [TrendingUp, Clock3, Gem][index] ?? Activity;

          return (
            <article
              key={card.label}
              className="rounded-lg border border-amber-300/15 bg-zinc-950/85 p-5 shadow-2xl shadow-black/40"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-400">{card.label}</p>
                <Icon className="h-5 w-5 text-amber-300" strokeWidth={1.8} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-normal text-white">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{card.helper}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-amber-300/15 bg-zinc-950/85 p-5">
          <h2 className="text-lg font-semibold text-white">Most Active Trading Hours</h2>
          <div className="mt-5 space-y-3">
            {activeHours.length > 0 ? (
              activeHours.map((item) => (
                <div key={item.hour} className="flex items-center gap-3">
                  <span className="w-14 text-sm font-medium text-amber-200">{item.hour}</span>
                  <div className="h-2 flex-1 rounded-full bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-amber-300"
                      style={{
                        width: `${Math.max(
                          12,
                          (item.trades / activeHours[0].trades) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm text-slate-400">
                    {item.trades}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No trade-hour data yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-amber-300/15 bg-zinc-950/85 p-5">
          <h2 className="text-lg font-semibold text-white">Popular Assets</h2>
          <div className="mt-5 divide-y divide-amber-300/10">
            {popularAssets.length > 0 ? (
              popularAssets.map((asset) => (
                <div
                  key={asset.asset}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 py-3 text-sm"
                >
                  <span className="font-medium text-slate-100">{asset.asset}</span>
                  <span className="text-slate-400">{asset.trades} trades</span>
                  <span className="text-amber-200">{asset.ticks} ticks</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No asset data yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
