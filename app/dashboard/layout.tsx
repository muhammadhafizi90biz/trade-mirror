import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserSidebar } from "./components/user-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <UserSidebar />
      <section className="relative z-10 px-5 py-6 lg:ml-72 lg:px-8 lg:py-8">
        {children}
      </section>
    </main>
  );
}
