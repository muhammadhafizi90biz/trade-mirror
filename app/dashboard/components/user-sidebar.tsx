import Link from "next/link";
import {
  BookPlus,
  CalendarDays,
  History,
  LayoutDashboard,
  LogOut,
  ScanLine,
} from "lucide-react";
import { signOutUser } from "@/app/login/actions";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/add-trade",
    label: "Add Trade",
    icon: BookPlus,
  },
  {
    href: "/dashboard/trades",
    label: "Trade History",
    icon: History,
  },
  {
    href: "/dashboard/pnl-calendar",
    label: "P&L Calendar",
    icon: CalendarDays,
  },
];

export function UserSidebar() {
  return (
    <aside className="border-emerald-400/15 bg-slate-950/90 px-5 py-6 lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-r">
      <Link href="/dashboard" className="flex items-center gap-3 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10">
          <ScanLine className="h-5 w-5 text-emerald-300" strokeWidth={1.8} />
        </span>
        <span>
          <span className="block text-lg font-semibold">TradeMirror</span>
          <span className="block text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            Trader Workspace
          </span>
        </span>
      </Link>

      <nav className="mt-10 space-y-2" aria-label="Dashboard">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-medium text-slate-300 transition hover:border-emerald-300/25 hover:bg-emerald-300/10 hover:text-white"
            >
              <Icon className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.06] p-4">
        <p className="text-sm font-semibold text-emerald-200">Daily reflection</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Log the trade, then review the pattern. Small notes compound.
        </p>
      </div>

      <form action={signOutUser} className="mt-8">
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
