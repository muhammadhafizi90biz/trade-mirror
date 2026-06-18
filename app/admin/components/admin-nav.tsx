import Link from "next/link";
import {
  Bell,
  BadgeDollarSign,
  LogOut,
  Newspaper,
  ScanLine,
  Settings,
  Shield,
  TableProperties,
  Users,
} from "lucide-react";
import { signOutUser } from "@/app/login/actions";

const navItems = [
  { href: "/admin/users", label: "Users Overview", icon: Users },
  { href: "/admin/trades", label: "Global Trade Logs", icon: TableProperties },
  { href: "/admin/cms", label: "Market News (CMS)", icon: Newspaper },
  { href: "/admin/assets", label: "Asset Settings", icon: BadgeDollarSign },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
];

export function AdminNav() {
  return (
    <aside className="border-amber-400/15 bg-black/80 px-5 py-6 lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-r">
      <Link href="/admin" className="flex items-center gap-3 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-300/25 bg-amber-300/10">
          <Shield className="h-5 w-5 text-amber-300" strokeWidth={1.8} />
        </span>
        <span>
          <span className="block text-lg font-semibold">TradeMirror</span>
          <span className="block text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
            Admin Console
          </span>
        </span>
      </Link>

      <nav className="mt-10 space-y-2" aria-label="Admin">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-medium text-slate-300 transition hover:border-amber-300/25 hover:bg-amber-300/10 hover:text-white"
            >
              <Icon className="h-4 w-4 text-amber-300" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 rounded-lg border border-amber-300/15 bg-amber-300/[0.07] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
          <Bell className="h-4 w-4" strokeWidth={1.8} />
          Elevated access
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Every mutation is rechecked on the server before touching Supabase.
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-amber-200"
      >
        <ScanLine className="h-4 w-4" strokeWidth={1.8} />
        Back to landing
      </Link>

      <form action={signOutUser} className="mt-4">
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-rose-400/20 px-3 text-sm font-semibold text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-400/10"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
          Logout
        </button>
      </form>
    </aside>
  );
}
