import { TradeForm } from "./trade-form";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

async function getAssetOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("asset_settings")
    .select("asset_name,asset_code")
    .order("asset_code", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export default async function AddTradePage() {
  const assets = await getAssetOptions();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-emerald-300/15 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Trade Journal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
          Add Trade
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Record the setup, result, and psychology behind the trade.
        </p>
      </div>

      <TradeForm assets={assets} />
    </div>
  );
}
