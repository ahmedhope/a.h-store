import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  redirect("/admin/products");
}
