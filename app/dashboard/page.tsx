import Link from "next/link";
import { LogOut, ScanLine, UserRound } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutUser } from "@/app/login/actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#020617] px-5 py-8 text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10">
            <ScanLine className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
          </span>
          <span className="text-lg font-semibold tracking-normal text-white">
            TradeMirror
          </span>
        </Link>

        <form action={signOutUser}>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-rose-400/20 px-3 text-sm font-semibold text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-400/10"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            Logout
          </button>
        </form>
      </div>

      <section className="mx-auto mt-16 w-full max-w-6xl rounded-lg border border-white/10 bg-slate-950/85 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400/10">
            <UserRound className="h-5 w-5 text-emerald-300" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              User Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-white">
              Welcome to TradeMirror
            </h1>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
          You are signed in as {user.email ?? user.id}. This is the default
          landing page for regular users while the trading journal workspace is
          being expanded.
        </p>
      </section>
    </main>
  );
}
