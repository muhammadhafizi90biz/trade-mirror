import { getUsersOverviewData } from "@/lib/admin/data";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  const { users, session } = await getUsersOverviewData();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="border-b border-amber-300/15 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Users Overview
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
          Registered Users
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Review account creation, trading activity, and admin privileges.
        </p>
      </div>

      <UsersTable
        users={users}
        currentUserId={session.userId}
        canManageAdmins={Boolean(session.profile.is_super_admin)}
      />
    </div>
  );
}
