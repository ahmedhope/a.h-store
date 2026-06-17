import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CouponForm } from "@/components/admin/coupon-form";
import { notFound } from "next/navigation";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  return <CouponForm coupon={{ ...coupon, expiresAt: coupon.expiresAt?.toISOString() || null }} />;
}
