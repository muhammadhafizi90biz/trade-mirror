"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Mail } from "lucide-react";
import {
  sendPasswordReset,
  type ForgotPasswordState,
} from "./actions";

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    sendPasswordReset,
    initialState,
  );

  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm font-medium text-slate-300">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 rounded-lg border border-emerald-400/20 bg-slate-950 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/70"
          placeholder="you@example.com"
        />
      </label>

      {state.message ? (
        <p
          className={
            state.success
              ? "rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
              : "rounded-lg border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
          }
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Mail className="h-4 w-4" strokeWidth={2} />
        {pending ? "Sending..." : "Send Reset Email"}
      </button>

      <Link
        href="/login"
        className="text-center text-sm font-medium text-slate-400 transition hover:text-emerald-200"
      >
        Back to login
      </Link>
    </form>
  );
}
