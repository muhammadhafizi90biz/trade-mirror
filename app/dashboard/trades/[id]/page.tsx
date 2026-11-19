import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, FileText, TrendingUp } from "lucide-react";
import { getUserTradeDetails } from "@/lib/dashboard/data";

export const dynamic = "force-dynamic";

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

function ticksClass(ticks: number | null) {
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

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-emerald-300/10 bg-black/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 text-sm font-medium text-slate-100">{value}</div>
    </div>
  );
}

function ReflectionItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg border border-emerald-300/10 bg-slate-950/70 p-4">
      <p className="text-sm font-semibold text-emerald-200">{label}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
        {value || "No answer recorded."}
      </p>
    </div>
  );
}

export default async function TradeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { trade } = await getUserTradeDetails(id);

  if (!trade) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/trades"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-300/25 px-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to Trade History
      </Link>

      <section className="mt-6 rounded-lg border border-emerald-300/15 bg-slate-950/85 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Trade Details
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
              {trade.asset ?? "Unknown Asset"}
            </h1>
            <p className="mt-2 font-mono text-xs text-slate-500">{trade.id}</p>
          </div>
          <div className={`text-4xl font-semibold ${ticksClass(trade.ticks)}`}>
            {(trade.ticks ?? 0).toLocaleString()} ticks
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <DetailItem
            label="Position"
            value={
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${positionClass(trade.position)}`}
              >
                {trade.position ?? "-"}
              </span>
            }
          />
          <DetailItem
            label="Contracts"
            value={(trade.contracts ?? 0).toLocaleString()}
          />
          <DetailItem
            label="Entry"
            value={
              <span>
                {formatPrice(trade.entry_price)}
                <span className="mt-1 block text-xs text-slate-500">
                  {formatDateTime(trade.entry_datetime)}
                </span>
              </span>
            }
          />
          <DetailItem
            label="Exit"
            value={
              <span>
                {formatPrice(trade.exit_price)}
                <span className="mt-1 block text-xs text-slate-500">
                  {formatDateTime(trade.exit_datetime)}
                </span>
              </span>
            }
          />
          <DetailItem
            label="Trade Time"
            value={
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
                {formatDateTime(trade.trade_time)}
              </span>
            }
          />
          <DetailItem
            label="Logged"
            value={
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
                {formatDateTime(trade.created_at)}
              </span>
            }
          />
          <DetailItem
            label="Result"
            value={
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
                <span className={ticksClass(trade.ticks)}>
                  {(trade.ticks ?? 0).toLocaleString()} ticks
                </span>
              </span>
            }
          />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Reflection Answers</h2>
        <div className="mt-4 grid gap-4">
          <ReflectionItem label="Did I follow my rules?" value={trade.followed_rules} />
          <ReflectionItem
            label="What was I feeling before enter the trade?"
            value={trade.feeling_before}
          />
          <ReflectionItem
            label="What was I feeling during the trade?"
            value={trade.feeling_during}
          />
          <ReflectionItem
            label="What was I feeling after the trade?"
            value={trade.feeling_after}
          />
          <ReflectionItem label="Did I move my stop?" value={trade.moved_stop} />
          <ReflectionItem
            label="Did I take profit too early?"
            value={trade.profit_too_early}
          />
          <ReflectionItem label="Did I hesitate?" value={trade.hesitated} />
          <ReflectionItem label="Did I revenge trade?" value={trade.revenge_trade} />
        </div>
      </section>
    </div>
  );
}
