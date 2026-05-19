import type { Metadata } from "next";
import { AdminNav } from "./components/admin-nav";

export const metadata: Metadata = {
  title: "Admin | TradeMirror",
  description: "Protected TradeMirror admin console.",
};

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#050505] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(245,158,11,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <AdminNav />
      <section className="relative z-10 px-5 py-6 lg:ml-72 lg:px-8 lg:py-8">
        {children}
      </section>
    </main>
  );
}
