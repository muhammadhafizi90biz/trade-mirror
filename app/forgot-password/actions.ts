"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ForgotPasswordState = {
  message?: string;
  success?: boolean;
};

export async function sendPasswordReset(
  _state: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = formData.get("email");

  if (typeof email !== "string" || email.trim().length === 0) {
    return { message: "Email is required.", success: false };
  }

  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    `${headersList.get("x-forwarded-proto") ?? "http"}://${headersList.get("host")}`;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { message: error.message, success: false };
  }

  return {
    message: "Password reset email sent. Check your inbox and follow the link.",
    success: true,
  };
}
