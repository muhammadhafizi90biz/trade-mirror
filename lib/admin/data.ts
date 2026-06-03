import "server-only";

import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Profile, Trade } from "@/lib/supabase/types";

export type UserOverviewRow = Profile & {
  total_trades: number;
};

export type AnalyticsCard = {
  label: string;
  value: string;
  helper: string;
};

export type PopularAsset = {
  asset: string;
  trades: number;
  ticks: number;
};

export type ActiveHour = {
  hour: string;
  trades: number;
};

function formatHour(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function getTradeDate(trade: Trade) {
  return trade.trade_time ?? trade.created_at;
}

export async function getAdminHomeData() {
  const session = await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const { data: trades, error } = await supabase
    .from("trades")
    .select(
      "id,user_id,asset,ticks,trade_time,position,entry_price,entry_datetime,exit_price,exit_datetime,followed_rules,feeling_before,feeling_during,feeling_after,moved_stop,profit_too_early,hesitated,revenge_trade,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    throw new Error(error.message);
  }

  const rows = trades ?? [];
  const totalTicks = rows.reduce((sum, trade) => sum + (trade.ticks ?? 0), 0);
  const hourCounts = new Map<number, number>();
  const assetCounts = new Map<string, PopularAsset>();

  rows.forEach((trade) => {
    const date = new Date(getTradeDate(trade));

    if (!Number.isNaN(date.getTime())) {
      const hour = date.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    }

    const asset = trade.asset?.trim() || "Unknown";
    const current = assetCounts.get(asset) ?? { asset, trades: 0, ticks: 0 };
    current.trades += 1;
    current.ticks += trade.ticks ?? 0;
    assetCounts.set(asset, current);
  });

  const activeHours = Array.from(hourCounts.entries())
    .map(([hour, count]) => ({ hour: formatHour(hour), trades: count }))
    .sort((a, b) => b.trades - a.trades)
    .slice(0, 5);

  const popularAssets = Array.from(assetCounts.values())
    .sort((a, b) => b.trades - a.trades || b.ticks - a.ticks)
    .slice(0, 5);

  const mostActiveHour = activeHours[0]?.hour ?? "No trades yet";
  const topAsset = popularAssets[0]?.asset ?? "No assets yet";

  return {
    session,
    cards: [
      {
        label: "Total Ticks Traded",
        value: totalTicks.toLocaleString(),
        helper: `${rows.length.toLocaleString()} trades audited`,
      },
      {
        label: "Most Active Hour",
        value: mostActiveHour,
        helper: activeHours[0]
          ? `${activeHours[0].trades.toLocaleString()} trades in this hour`
          : "Waiting for trade history",
      },
      {
        label: "Popular Asset",
        value: topAsset,
        helper: popularAssets[0]
          ? `${popularAssets[0].trades.toLocaleString()} trades logged`
          : "No asset data available",
      },
    ] satisfies AnalyticsCard[],
    activeHours,
    popularAssets,
  };
}

export async function getUsersOverviewData() {
  const session = await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const [{ data: profiles, error: profilesError }, { data: trades, error: tradesError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id,email,created_at,is_admin,is_super_admin")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase.from("trades").select("user_id").limit(5000),
    ]);

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  if (tradesError) {
    throw new Error(tradesError.message);
  }

  const tradeCounts = new Map<string, number>();
  (trades ?? []).forEach((trade) => {
    tradeCounts.set(trade.user_id, (tradeCounts.get(trade.user_id) ?? 0) + 1);
  });

  return {
    session,
    users: (profiles ?? []).map((profile) => ({
      ...profile,
      total_trades: tradeCounts.get(profile.id) ?? 0,
    })) satisfies UserOverviewRow[],
  };
}

export async function getTradeAuditData() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const { data: trades, error } = await supabase
    .from("trades")
    .select(
      "id,user_id,asset,ticks,trade_time,position,entry_price,entry_datetime,exit_price,exit_datetime,followed_rules,feeling_before,feeling_during,feeling_after,moved_stop,profit_too_early,hesitated,revenge_trade,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    throw new Error(error.message);
  }

  return trades ?? [];
}
