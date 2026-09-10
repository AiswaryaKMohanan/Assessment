import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Welcome, {session.user.name ?? session.user.email}.</p>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-black/10 px-3 py-2 text-sm font-medium dark:border-white/15"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
