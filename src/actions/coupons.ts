"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CouponSchema = z.object({
  code: z.string().min(1, "الكود مطلوب").transform((v) => v.trim().toUpperCase()),
  discount: z.coerce.number().positive("الخصم يجب أن يكون أكبر من 0"),
  type: z.enum(["percentage", "fixed"]).default("percentage"),
  minOrder: z.coerce.number().default(0),
  maxUses: z.coerce.number().int().default(0),
  expiresAt: z.string().optional(),
});

export async function createCoupon(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = CouponSchema.parse(raw);

    await prisma.coupon.create({
      data: {
        ...parsed,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      },
    });

    logger.info("Coupon created", { code: parsed.code });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err: any) {
    logger.error("createCoupon failed", { error: err.message });
    return { error: err.message };
  }
}

export async function updateCoupon(id: string, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = CouponSchema.parse(raw);

    await prisma.coupon.update({
      where: { id },
      data: {
        ...parsed,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      },
    });

    logger.info("Coupon updated", { id, code: parsed.code });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err: any) {
    logger.error("updateCoupon failed", { error: err.message });
    return { error: err.message };
  }
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(id: string, isActive: boolean) {
  await prisma.coupon.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/coupons");
}

export async function getCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getCoupon(code: string) {
  return prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
}

export async function validateCoupon(code: string, orderTotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!coupon) return { valid: false, error: "كود الخصم غير صحيح" };
  if (!coupon.isActive) return { valid: false, error: "كود الخصم غير نشط" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, error: "انتهت صلاحية كود الخصم" };
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return { valid: false, error: "تم استنفاذ عدد مرات استخدام الكود" };
  if (orderTotal < coupon.minOrder) return { valid: false, error: `الحد الأدنى للطلب هو ${coupon.minOrder} جنيه` };

  let discount = coupon.type === "percentage" ? orderTotal * (coupon.discount / 100) : coupon.discount;
  discount = Math.min(discount, orderTotal);

  return { valid: true, coupon, discount };
}
