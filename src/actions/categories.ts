"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { z } from "zod";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;

  await prisma.category.create({
    data: { name, slug: slugify(name) + "-" + Date.now() },
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message.includes("foreign key") || err.message.includes("ForeignKey") || err.message.includes("constraint") ? "لا يمكن حذف الفئة لأنها تحتوي على منتجات" : err.message };
  }
}
