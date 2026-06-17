import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession();
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");
  return session;
}
