import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return redirect("/auth/login?returnTo=/");
  }

  return <Dashboard />;
}
