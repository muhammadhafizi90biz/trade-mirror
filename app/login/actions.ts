"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export type LoginState = {
  message?: string;
  success?: boolean;
};

function getRequiredField(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

async function getPostLoginDestination(userId: string) {
  const adminSupabase = createSupabaseAdminClient();
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  return profile?.is_admin ? "/admin" : "/dashboard";
}

export async function signInUser(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  let email: string;
  let password: string;

  try {
    email = getRequiredField(formData, "email");
    password = getRequiredField(formData, "password");
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Email and password are required.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }

  if (!data.user) {
    return { message: "Unable to load the signed-in user." };
  }

  redirect(await getPostLoginDestination(data.user.id));
}

export async function registerUser(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  let email: string;
  let password: string;
  let confirmPassword: string;

  try {
    email = getRequiredField(formData, "email");
    password = getRequiredField(formData, "password");
    confirmPassword = getRequiredField(formData, "confirmPassword");
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "All fields are required.",
    };
  }

  if (password.length < 8) {
    return { message: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { message: "Passwords do not match." };
  }

  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    `${headersList.get("x-forwarded-proto") ?? "http"}://${headersList.get("host")}`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return { message: error.message };
  }

  if (data.user) {
    const adminSupabase = createSupabaseAdminClient();
    const { error: profileError } = await adminSupabase.from("profiles").upsert({
      id: data.user.id,
      email,
      is_admin: false,
      is_super_admin: false,
    });

    if (profileError) {
      return { message: profileError.message };
    }
  }

  if (!data.session) {
    return {
      message:
        "Registration created. Check your email to confirm your account before signing in.",
      success: true,
    };
  }

  redirect("/dashboard");
}

export async function signOutUser() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  redirect("/login");
}
