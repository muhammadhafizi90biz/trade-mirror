"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveTradeState = {
  message?: string;
  success?: boolean;
};

function readRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function readOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readRequiredNumber(formData: FormData, key: string) {
  const value = Number(readRequiredString(formData, key));

  if (Number.isNaN(value)) {
    throw new Error(`${key} must be a valid number.`);
  }

  return value;
}

function parseDatetime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Date and time must be valid.");
  }

  return date.toISOString();
}

function calculateTicks(position: "long" | "short", entryPrice: number, exitPrice: number) {
  const priceDifference = position === "short" ? entryPrice - exitPrice : exitPrice - entryPrice;
  return Math.round(priceDifference * 100);
}

export async function saveTrade(
  _state: SaveTradeState,
  formData: FormData,
): Promise<SaveTradeState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Please sign in before saving a trade.", success: false };
  }

  try {
    const asset = readRequiredString(formData, "assets");
    const positionValue = readRequiredString(formData, "position");

    if (positionValue !== "long" && positionValue !== "short") {
      return { message: "Position must be long or short.", success: false };
    }

    const entryPrice = readRequiredNumber(formData, "entry_price");
    const exitPrice = readRequiredNumber(formData, "exit_price");
    const entryDatetime = parseDatetime(readRequiredString(formData, "entry_datetime"));
    const exitDatetime = parseDatetime(readRequiredString(formData, "exit_datetime"));
    const ticks = calculateTicks(positionValue, entryPrice, exitPrice);
    const adminSupabase = createSupabaseAdminClient();

    const { error } = await adminSupabase.from("trades").insert({
      user_id: user.id,
      asset,
      position: positionValue,
      entry_price: entryPrice,
      entry_datetime: entryDatetime,
      exit_price: exitPrice,
      exit_datetime: exitDatetime,
      ticks,
      trade_time: entryDatetime,
      followed_rules: readOptionalString(formData, "followed_rules"),
      feeling_before: readOptionalString(formData, "feeling_before"),
      feeling_during: readOptionalString(formData, "feeling_during"),
      feeling_after: readOptionalString(formData, "feeling_after"),
      moved_stop: readOptionalString(formData, "moved_stop"),
      profit_too_early: readOptionalString(formData, "profit_too_early"),
      hesitated: readOptionalString(formData, "hesitated"),
      revenge_trade: readOptionalString(formData, "revenge_trade"),
    });

    if (error) {
      return { message: error.message, success: false };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/add-trade");
    return { message: "Trade saved successfully.", success: true };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Unable to save trade.",
      success: false,
    };
  }
}
