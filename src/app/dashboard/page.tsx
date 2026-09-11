import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardNavbar } from "./navbar";
import { TimesheetTable } from "./timesheet-table";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userName = session.user.name ?? session.user.email ?? "User";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <DashboardNavbar userName={userName} />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <TimesheetTable />
      </main>

      <footer className="py-6 text-center text-xs text-gray-400">
        © 2024 tentwenty. All rights reserved.
      </footer>
    </div>
  );
}
