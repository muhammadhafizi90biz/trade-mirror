import Link from "next/link";
import { LogOut, ScanLine, Shield, UserRound } from "lucide-react";
import { LoginForm, RegisterForm } from "./login-form";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutUser } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let adminStatus:
    | { is_admin: boolean | null; is_super_admin: boolean | null }
    | null = null;

  if (user) {
    const adminSupabase = createSupabaseAdminClient();
    const { data } = await adminSupabase
      .from("profiles")
      .select("is_admin,is_super_admin")
      .eq("id", user.id)
      .maybeSingle();

    adminStatus = data;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-5 py-12 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <section className="relative z-10 w-full max-w-5xl rounded-lg border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-emerald-950/25 sm:p-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10">
            <ScanLine className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
          </span>
          <span className="text-lg font-semibold tracking-normal text-white">
            TradeMirror
          </span>
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-300/10">
            <UserRound className="h-5 w-5 text-amber-300" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Account Access
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Sign in to TradeMirror
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          One login for traders and admins. Admin accounts go to the admin
          console; regular users go to their dashboard.
        </p>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm">
          {user ? (
            <div className="space-y-2">
              <p className="font-semibold text-emerald-300">Session detected</p>
              <p className="break-all text-slate-400">{user.email ?? user.id}</p>
              <p className="text-slate-400">
                Access:{" "}
                <span className="font-semibold text-slate-200">
                  {adminStatus?.is_admin ? "Admin" : "User"}
                </span>
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  href={adminStatus?.is_admin ? "/admin" : "/dashboard"}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-400/25 px-3 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
                >
                  <Shield className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Continue
                </Link>
              </div>
              <form action={signOutUser} className="pt-2">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-400/25 px-3 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10"
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <p className="text-slate-400">No Supabase session detected in this browser yet.</p>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-semibold text-white">Sign In</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use your existing TradeMirror account.
            </p>
            <LoginForm />
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-semibold text-white">Create Account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Register as a new TradeMirror user.
            </p>
            <RegisterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
