import { RadioTower } from "lucide-react";
import { createBroadcast } from "../actions";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-amber-300/15 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          System Settings
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
          Platform Broadcast
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Store a system notification for all TradeMirror users.
        </p>
      </div>

      <form
        action={createBroadcast}
        className="mt-6 rounded-lg border border-amber-300/15 bg-zinc-950/85 p-5"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
            <RadioTower className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white">Broadcast Message</h2>
            <p className="text-sm text-slate-500">Saved to `system_notifications` with audience all.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Title
            <input
              name="title"
              required
              className="h-11 rounded-lg border border-amber-300/20 bg-black px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60"
              placeholder="Platform notice"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Message
            <textarea
              name="message"
              required
              rows={6}
              className="rounded-lg border border-amber-300/20 bg-black px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60"
              placeholder="Write the notification message..."
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-amber-300 px-5 text-sm font-bold text-black transition hover:bg-amber-200"
        >
          Broadcast
        </button>
      </form>
    </div>
  );
}
