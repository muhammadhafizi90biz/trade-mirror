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

type CalendarTrade = Pick<
  Trade,
  | "id"
  | "asset"
  | "position"
  | "entry_price"
  | "entry_datetime"
  | "exit_price"
  | "exit_datetime"
  | "ticks"
  | "trade_time"
  | "created_at"
>;

export type CalendarDay = {
  dateKey: string;
  dayNumber: number;
  pnl: number;
  tradeCount: number;
};

export type CalendarDayDetails = CalendarDay & {
  trades: (CalendarTrade & { pnl: number })[];
};

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

export function getKualaLumpurMonthRange(year: number, month: number) {
  const start = Date.UTC(year, month - 1, 1) - KUALA_LUMPUR_OFFSET_MS;
  const end = Date.UTC(year, month, 1) - KUALA_LUMPUR_OFFSET_MS;

  return {
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
  };
}

function getKualaLumpurDateKey(value: string | null) {
  const source = value ? new Date(value) : new Date();
  const local = new Date(source.getTime() + KUALA_LUMPUR_OFFSET_MS);
  const year = local.getUTCFullYear();
  const month = String(local.getUTCMonth() + 1).padStart(2, "0");
  const day = String(local.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonthOption(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
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

function calendarTradeSelect() {
  return "id,asset,position,entry_price,entry_datetime,exit_price,exit_datetime,ticks,trade_time,created_at";
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

export async function getUserPnlCalendarData({
  year,
  month,
  selectedDay,
}: {
  year: number;
  month: number;
  selectedDay?: string;
}) {
  const user = await requireUser();
  const safeMonth = month >= 1 && month <= 12 ? month : new Date().getMonth() + 1;
  const safeYear = year >= 2000 && year <= 2100 ? year : new Date().getFullYear();
  const supabase = createSupabaseAdminClient();
  const monthRange = getKualaLumpurMonthRange(safeYear, safeMonth);

  const [
    { data: trades, error: tradesError },
    { data: assetSettings, error: assetError },
  ] = await Promise.all([
    supabase
      .from("trades")
      .select(calendarTradeSelect())
      .eq("user_id", user.id)
      .gte("trade_time", monthRange.start)
      .lt("trade_time", monthRange.end)
      .order("trade_time", { ascending: true }),
    supabase.from("asset_settings").select("asset_code,price_per_tick"),
  ]);

  const error = tradesError ?? assetError;

  if (error) {
    throw new Error(error.message);
  }

  const priceByAsset = new Map<string, number>();
  (assetSettings ?? []).forEach((setting) => {
    priceByAsset.set(String(setting.asset_code), Number(setting.price_per_tick));
  });

  const daysInMonth = new Date(Date.UTC(safeYear, safeMonth, 0)).getUTCDate();
  const dayMap = new Map<string, CalendarDayDetails>();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = `${safeYear}-${String(safeMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dayMap.set(dateKey, {
      dateKey,
      dayNumber: day,
      pnl: 0,
      tradeCount: 0,
      trades: [],
    });
  }

  ((trades ?? []) as unknown as CalendarTrade[]).forEach((trade) => {
    const dateKey = getKualaLumpurDateKey(trade.trade_time ?? trade.entry_datetime);
    const day = dayMap.get(dateKey);

    if (!day) {
      return;
    }

    const pricePerTick = priceByAsset.get(trade.asset ?? "") ?? 1;
    const pnl = (trade.ticks ?? 0) * pricePerTick;

    day.pnl += pnl;
    day.tradeCount += 1;
    day.trades.push({ ...trade, pnl });
  });

  const days = Array.from(dayMap.values());
  const tradingDays = days.filter((day) => day.tradeCount > 0);
  const winningDays = tradingDays.filter((day) => day.pnl > 0).length;
  const losingDays = tradingDays.filter((day) => day.pnl < 0).length;
  const totalTrades = tradingDays.reduce((total, day) => total + day.tradeCount, 0);
  const selectedDateKey = selectedDay && dayMap.has(selectedDay) ? selectedDay : undefined;
  const previousDate = safeMonth === 1 ? { year: safeYear - 1, month: 12 } : { year: safeYear, month: safeMonth - 1 };
  const nextDate = safeMonth === 12 ? { year: safeYear + 1, month: 1 } : { year: safeYear, month: safeMonth + 1 };

  return {
    user,
    year: safeYear,
    month: safeMonth,
    monthValue: getMonthOption(safeYear, safeMonth),
    previousMonthValue: getMonthOption(previousDate.year, previousDate.month),
    nextMonthValue: getMonthOption(nextDate.year, nextDate.month),
    firstDayOffset: new Date(Date.UTC(safeYear, safeMonth - 1, 1)).getUTCDay(),
    days,
    selectedDay: selectedDateKey ? dayMap.get(selectedDateKey) : undefined,
    summary: {
      totalPnl: days.reduce((total, day) => total + day.pnl, 0),
      winningDays,
      losingDays,
      winRate: tradingDays.length > 0 ? (winningDays / tradingDays.length) * 100 : 0,
      totalTrades,
    },
  };
}

export type MonthlyProfit = {
  monthKey: string;
  year: number;
  month: number;
  label: string;
  pnl: number;
  ticks: number;
  tradeCount: number;
};

export async function getUserMonthlyProfitData(): Promise<MonthlyProfit[]> {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();

  const klParts = getKualaLumpurDateParts();
  const endYear = klParts.year;
  const endMonth = klParts.month + 1;

  let startYear = endYear;
  let startMonth = endMonth - 11;
  if (startMonth <= 0) {
    startYear -= 1;
    startMonth += 12;
  }

  const startRange = getKualaLumpurMonthRange(startYear, startMonth);
  const nextMonth = endMonth === 12 ? 1 : endMonth + 1;
  const nextYear = endMonth === 12 ? endYear + 1 : endYear;
  const endRange = getKualaLumpurMonthRange(nextYear, nextMonth);

  const [{ data: trades, error: tradesError }, { data: assetSettings, error: assetError }] =
    await Promise.all([
      supabase
        .from("trades")
        .select("ticks, trade_time, entry_datetime, asset")
        .eq("user_id", user.id)
        .gte("trade_time", startRange.start)
        .lt("trade_time", endRange.end),
      supabase.from("asset_settings").select("asset_code, price_per_tick"),
    ]);

  const error = tradesError ?? assetError;
  if (error) {
    throw new Error(error.message);
  }

  const priceByAsset = new Map<string, number>();
  (assetSettings ?? []).forEach((setting) => {
    priceByAsset.set(String(setting.asset_code), Number(setting.price_per_tick));
  });

  const monthMap = new Map<string, MonthlyProfit>();
  for (let i = 0; i < 12; i++) {
    let m = startMonth + i;
    let y = startYear;
    if (m > 12) {
      m -= 12;
      y += 1;
    }
    const monthKey = `${y}-${String(m).padStart(2, "0")}`;
    const date = new Date(Date.UTC(y, m - 1, 1));
    const label = date.toLocaleDateString("en-MY", {
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
    });
    monthMap.set(monthKey, { monthKey, year: y, month: m, label, pnl: 0, ticks: 0, tradeCount: 0 });
  }

  ((trades ?? []) as { ticks: number | null; trade_time: string | null; entry_datetime: string | null; asset: string | null }[]).forEach(
    (trade) => {
      const source = trade.trade_time ?? trade.entry_datetime;
      if (!source) {
        return;
      }
      const kl = new Date(new Date(source).getTime() + KUALA_LUMPUR_OFFSET_MS);
      const y = kl.getUTCFullYear();
      const m = kl.getUTCMonth() + 1;
      const monthKey = `${y}-${String(m).padStart(2, "0")}`;
      const entry = monthMap.get(monthKey);
      if (!entry) {
        return;
      }
      const ticks = trade.ticks ?? 0;
      const pricePerTick = priceByAsset.get(trade.asset ?? "") ?? 1;
      entry.pnl += ticks * pricePerTick;
      entry.ticks += ticks;
      entry.tradeCount += 1;
    },
  );

  return Array.from(monthMap.values());
}
