import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col lg:flex-row">
      <section className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12 sm:px-10 lg:w-1/2 lg:flex-none lg:px-20">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </section>

      <section className="flex w-full flex-1 items-center justify-center bg-blue-600 px-6 py-10 sm:px-10 lg:w-1/2 lg:flex-none lg:px-20 lg:py-12">
        <div className="w-full max-w-sm text-white">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            ticktock
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-blue-100 sm:text-base">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours.
            With ticktock, you can effortlessly track and monitor employee
            attendance and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </section>
    </main>
  );
}
