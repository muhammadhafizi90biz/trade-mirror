import { Activity, BookPlus, CalendarDays, UserRound } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
            label: "Trades Logged",
            value: "0",
            helper: "Add your first trade to begin tracking.",
            icon: BookPlus,
          },
          {
            label: "This Week",
            value: "0",
            helper: "Weekly activity will appear here.",
            icon: CalendarDays,
          },
          {
            label: "Reflection Score",
            value: "--",
            helper: "Built from trade notes and reviews.",
            icon: Activity,
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
    </div>
  );
}
