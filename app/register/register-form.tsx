"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { registerUser, type LoginState } from "../login/actions";

const initialState: LoginState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerUser, initialState);

  return (
    <form action={action} className="grid gap-4">
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

      <label className="grid gap-2 text-sm font-medium text-slate-300">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-12 rounded-lg border border-emerald-400/20 bg-slate-950 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/70"
          placeholder="At least 8 characters"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-300">
        Confirm password
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-12 rounded-lg border border-emerald-400/20 bg-slate-950 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/70"
          placeholder="Repeat your password"
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
        <UserPlus className="h-4 w-4" strokeWidth={2} />
        {pending ? "Creating account..." : "Create Account"}
      </button>

      <p className="mt-2 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
          Sign in
        </Link>
      </p>
    </form>
  );
}
