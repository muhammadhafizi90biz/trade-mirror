import { getTradeAuditData } from "@/lib/admin/data";
import { TradesTable } from "./trades-table";

export default async function AdminTradesPage() {
  const trades = await getTradeAuditData();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="border-b border-amber-300/15 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Global Trade Logs
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
          Trade Audit Log
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Master trade ledger with sorting and user-level filtering.
        </p>
      </div>

      <TradesTable trades={trades} />
    </div>
  );
}
