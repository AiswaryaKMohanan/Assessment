import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardNavbar } from "../../navbar";
import { getTimesheetRow } from "../../mock-data";
import { WeeklyTimesheet } from "./weekly-timesheet";

export default async function TimesheetWeekPage({
  params,
}: PageProps<"/dashboard/timesheets/[week]">) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { week } = await params;
  const weekNumber = Number(week);
  const row = Number.isInteger(weekNumber)
    ? getTimesheetRow(weekNumber)
    : undefined;

  if (!row) {
    notFound();
  }

  const userName = session.user.name ?? session.user.email ?? "User";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <DashboardNavbar userName={userName} />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <WeeklyTimesheet row={row} />
      </main>

      <footer className="py-6 text-center text-xs text-gray-400">
        © 2024 tentwenty. All rights reserved.
      </footer>
    </div>
  );
}
