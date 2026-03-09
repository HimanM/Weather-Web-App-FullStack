import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import DebugDashboard from "./DebugDashboard";

export default async function DebugPage() {
  const session = await auth0.getSession();

  if (!session) {
    return redirect("/auth/login?returnTo=/debug");
  }

  return <DebugDashboard />;
}
