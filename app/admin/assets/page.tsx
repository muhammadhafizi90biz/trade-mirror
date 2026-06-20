import { BadgeDollarSign, Plus } from "lucide-react";
import { createAssetSetting } from "../actions";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { AssetSetting } from "@/lib/supabase/types";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

async function getAssetSettings() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("asset_settings")
    .select("id,asset_name,asset_code,price_per_tick,created_by,created_at")
    .order("asset_code", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AssetSetting[];
}

export default async function AdminAssetsPage() {
  const assets = await getAssetSettings();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="border-b border-amber-300/15 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Asset Settings
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
          Configure Assets
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Add tradable assets and define the price-per-tick used by TradeMirror.
        </p>
      </div>

      <form
        action={createAssetSetting}
        className="mt-6 rounded-lg border border-amber-300/15 bg-zinc-950/85 p-5"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
            <BadgeDollarSign className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white">New Asset</h2>
            <p className="text-sm text-slate-500">
          Asset codes are stored uppercase to keep settings consistent.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr_0.8fr_auto] lg:items-end">
          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Asset Name
            <input
              name="asset_name"
              required
              className="h-11 rounded-lg border border-amber-300/20 bg-black px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60"
              placeholder="Crude Palm Oil Futures"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Asset Code
            <input
              name="asset_code"
              required
              className="h-11 rounded-lg border border-amber-300/20 bg-black px-4 text-white uppercase outline-none transition placeholder:normal-case placeholder:text-slate-600 focus:border-amber-300/60"
              placeholder="FCPO"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Price Per Tick
            <input
              name="price_per_tick"
              type="number"
              step="0.01"
              min="0.01"
              required
              className="h-11 rounded-lg border border-amber-300/20 bg-black px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60"
              placeholder="25.00"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-300 px-5 text-sm font-bold text-black transition hover:bg-amber-200"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Asset
          </button>
        </div>
      </form>

      <section className="mt-6 rounded-lg border border-amber-300/15 bg-zinc-950/85">
        <div className="border-b border-amber-300/10 p-5">
          <h2 className="text-lg font-semibold text-white">Configured Assets</h2>
          <p className="mt-1 text-sm text-slate-500">
            {assets.length.toLocaleString()} assets configured.
          </p>
        </div>

        {assets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-amber-300/10 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Asset Name</th>
                  <th className="px-4 py-3 font-semibold">Asset Code</th>
                  <th className="px-4 py-3 font-semibold">Price Per Tick</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-300/10">
                {assets.map((asset) => (
                  <tr key={asset.id} className="transition hover:bg-amber-300/[0.04]">
                    <td className="px-4 py-4 font-semibold text-white">
                      {asset.asset_name}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                        {asset.asset_code}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-amber-200">
                      {formatMoney(asset.price_per_tick)}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {new Intl.DateTimeFormat("en-MY", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Kuala_Lumpur",
                      }).format(new Date(asset.created_at))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 text-sm text-slate-500">
            No assets configured yet. Add the first asset above.
          </div>
        )}
      </section>
    </div>
  );
}
