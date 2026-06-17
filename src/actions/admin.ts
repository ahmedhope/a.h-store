"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function changePassword(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user?.email) return { error: "غير مصرح" };

  const current = formData.get("current") as string;
  const newPass = formData.get("newPassword") as string;

  if (!current || !newPass || newPass.length < 6) return { error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" };

  const admin = await prisma.adminUser.findUnique({ where: { email: session.user.email } });
  if (!admin) return { error: "المستخدم غير موجود" };

  const valid = await bcrypt.compare(current, admin.password);
  if (!valid) return { error: "كلمة المرور الحالية غير صحيحة" };

  const hashed = await bcrypt.hash(newPass, 12);
  await prisma.adminUser.update({ where: { email: session.user.email }, data: { password: hashed } });

  logger.info("Admin password changed", { email: session.user.email });
  return { success: true };
}

export async function updateStoreSettings(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user?.email) return { error: "غير مصرح" };

  const storeName = formData.get("storeName") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const currency = formData.get("currency") as string;

  if (storeName) {
    const fs = await import("fs/promises");
    const path = await import("path");
    const envPath = path.join(process.cwd(), ".env");
    let env = await fs.readFile(envPath, "utf-8");

    const updates: Record<string, string> = {};
    if (storeName) updates["NEXT_PUBLIC_STORE_NAME"] = storeName;
    if (whatsapp) updates["NEXT_PUBLIC_WHATSAPP_NUMBER"] = whatsapp;
    if (currency) updates["NEXT_PUBLIC_CURRENCY"] = currency;

    for (const [key, val] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*`, "m");
      if (regex.test(env)) {
        env = env.replace(regex, `${key}=${val}`);
      } else {
        env += `\n${key}=${val}`;
      }
    }

    await fs.writeFile(envPath, env, "utf-8");
    logger.info("Store settings updated", updates);
  }

  revalidatePath("/admin/settings");
  return { success: true };
}
