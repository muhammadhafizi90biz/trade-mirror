import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

type AdminSession = {
  userId: string;
  profile: Profile;
};

export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const adminSupabase = createSupabaseAdminClient();
  const { data: profile, error } = await adminSupabase
    .from("profiles")
    .select("id,email,created_at,is_admin,is_super_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) {
    redirect("/");
  }

  return { userId: user.id, profile };
}

export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdmin();

  if (!session.profile.is_super_admin) {
    throw new Error("Only super admins can perform this action.");
  }

  return session;
}
