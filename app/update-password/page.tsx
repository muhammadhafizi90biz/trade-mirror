import Link from "next/link";
import { KeyRound, ScanLine } from "lucide-react";
import { UpdatePasswordForm } from "./update-password-form";

export const dynamic = "force-dynamic";

export default function UpdatePasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-5 py-12 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <section className="relative z-10 w-full max-w-md rounded-lg border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-emerald-950/25 sm:p-8">
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
            <KeyRound className="h-5 w-5 text-amber-300" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Reset Session
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Update Password
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Choose a new password for the account opened by your reset email.
        </p>

        <UpdatePasswordForm />
      </section>
    </main>
  );
}
