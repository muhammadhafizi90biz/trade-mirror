"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireSuperAdmin } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

export async function toggleAdmin(formData: FormData) {
  const session = await requireSuperAdmin();
  const targetUserId = getRequiredString(formData, "userId");

  if (targetUserId === session.userId) {
    throw new Error("You cannot change your own admin access.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: targetProfile, error: readError } = await supabase
    .from("profiles")
    .select("id,is_admin,is_super_admin")
    .eq("id", targetUserId)
    .single();

  if (readError || !targetProfile) {
    throw new Error(readError?.message ?? "User profile was not found.");
  }

  if (targetProfile.is_super_admin) {
    throw new Error("Super admin accounts cannot be changed from this table.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_admin: !targetProfile.is_admin })
    .eq("id", targetUserId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function createMarketUpdate(formData: FormData) {
  const session = await requireAdmin();
  const title = getRequiredString(formData, "title");
  const body = getRequiredString(formData, "body");
  const statusInput = getRequiredString(formData, "status");
  const status = statusInput === "published" ? "published" : "draft";
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("market_posts").insert({
    title,
    body,
    status,
    created_by: session.userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/cms");
}

export async function createBroadcast(formData: FormData) {
  const session = await requireAdmin();
  const title = getRequiredString(formData, "title");
  const message = getRequiredString(formData, "message");
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("system_notifications").insert({
    title,
    message,
    audience: "all",
    created_by: session.userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
}

export async function createAssetSetting(formData: FormData) {
  const session = await requireAdmin();
  const assetName = getRequiredString(formData, "asset_name");
  const assetCode = getRequiredString(formData, "asset_code").toUpperCase();
  const rawPricePerTick = getRequiredString(formData, "price_per_tick");
  const pricePerTick = Number(rawPricePerTick);

  if (!/^[A-Z0-9._-]+$/.test(assetCode)) {
    throw new Error("Asset code can only contain letters, numbers, dots, underscores, or hyphens.");
  }

  if (Number.isNaN(pricePerTick) || pricePerTick <= 0) {
    throw new Error("Price per tick must be a positive number.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("asset_settings").insert({
    asset_name: assetName,
    asset_code: assetCode,
    price_per_tick: pricePerTick,
    created_by: session.userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/assets");
}
