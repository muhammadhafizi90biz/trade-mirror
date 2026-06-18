import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Trade } from "@/lib/supabase/types";

const KUALA_LUMPUR_OFFSET_MS = 8 * 60 * 60 * 1000;
export const TRADES_PAGE_SIZE = 10;

type UserSession = {
  id: string;
  email?: string;
};

export type TradeListItem = Pick<
  Trade,
  | "id"
  | "asset"
  | "position"
  | "entry_price"
  | "entry_datetime"
  | "exit_price"
  | "exit_datetime"
  | "ticks"
  | "created_at"
>;

export type TradeDetails = Trade;

function getKualaLumpurDateParts(date = new Date()) {
  const kualaLumpurDate = new Date(date.getTime() + KUALA_LUMPUR_OFFSET_MS);

  return {
    year: kualaLumpurDate.getUTCFullYear(),
    month: kualaLumpurDate.getUTCMonth(),
    date: kualaLumpurDate.getUTCDate(),
    day: kualaLumpurDate.getUTCDay(),
  };
}

function getKualaLumpurDayRange(date = new Date()) {
  const parts = getKualaLumpurDateParts(date);
  const start = Date.UTC(parts.year, parts.month, parts.date) - KUALA_LUMPUR_OFFSET_MS;
  const end = start + 24 * 60 * 60 * 1000;

  return {
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
  };
}

function getKualaLumpurWeekRange(date = new Date()) {
  const parts = getKualaLumpurDateParts(date);
  const daysSinceMonday = (parts.day + 6) % 7;
  const start =
    Date.UTC(parts.year, parts.month, parts.date - daysSinceMonday) -
    KUALA_LUMPUR_OFFSET_MS;
  const end = start + 7 * 24 * 60 * 60 * 1000;

  return {
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
  };
}

async function requireUser(): Promise<UserSession> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return {
    id: user.id,
    email: user.email,
  };
}

function sumTicks(trades: Pick<Trade, "ticks">[]) {
  return trades.reduce((total, trade) => total + (trade.ticks ?? 0), 0);
}

function tradeSelect() {
  return "id,asset,position,entry_price,entry_datetime,exit_price,exit_datetime,ticks,created_at";
}

function tradeDetailsSelect() {
  return "id,user_id,asset,ticks,trade_time,position,entry_price,entry_datetime,exit_price,exit_datetime,followed_rules,feeling_before,feeling_during,feeling_after,moved_stop,profit_too_early,hesitated,revenge_trade,created_at";
}

export async function getUserDashboardData() {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();
  const today = getKualaLumpurDayRange();
  const week = getKualaLumpurWeekRange();

  const [
    { data: todayTrades, error: todayError },
    { data: weekTrades, error: weekError },
    { data: allTrades, error: allError },
    { data: latestTrades, error: latestError, count },
  ] = await Promise.all([
    supabase
      .from("trades")
      .select("ticks")
      .eq("user_id", user.id)
      .gte("trade_time", today.start)
      .lt("trade_time", today.end),
    supabase
      .from("trades")
      .select("ticks")
      .eq("user_id", user.id)
      .gte("trade_time", week.start)
      .lt("trade_time", week.end),
    supabase.from("trades").select("ticks").eq("user_id", user.id),
    supabase
      .from("trades")
      .select(tradeSelect(), { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(0, TRADES_PAGE_SIZE - 1),
  ]);

  const error = todayError ?? weekError ?? allError ?? latestError;

  if (error) {
    throw new Error(error.message);
  }

  return {
    user,
    totals: {
      today: sumTicks(todayTrades ?? []),
      week: sumTicks(weekTrades ?? []),
      overall: sumTicks(allTrades ?? []),
    },
    latestTrades: (latestTrades ?? []) as unknown as TradeListItem[],
    totalTrades: count ?? 0,
  };
}

export async function getUserTradesPage(page: number) {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const from = (safePage - 1) * TRADES_PAGE_SIZE;
  const to = from + TRADES_PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("trades")
    .select(tradeSelect(), { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    user,
    trades: (data ?? []) as unknown as TradeListItem[],
    page: safePage,
    totalTrades: count ?? 0,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / TRADES_PAGE_SIZE)),
  };
}

export async function getUserTradeDetails(tradeId: string) {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("trades")
    .select(tradeDetailsSelect())
    .eq("id", tradeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    user,
    trade: data as unknown as TradeDetails | null,
  };
}
