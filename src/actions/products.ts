"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

const ProductSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("السعر يجب أن يكون أكبر من 0"),
  compareAt: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, "المخزون لا يمكن أن يكون سالباً"),
  categoryId: z.string().min(1, "الفئة مطلوبة"),
  images: z.string().optional(),
  isVisible: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  video: z.string().optional(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  tags: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = ProductSchema.parse(raw);

    let slug = slugify(parsed.name);
    // Ensure unique slug
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const { tags: _t, sizes: _s, colors: _c, video: _v, ...rest } = parsed;
    const data: any = {
      ...rest,
      slug,
      isVisible: parsed.isVisible ?? true,
    };
    if (parsed.tags !== undefined) data.tags = parsed.tags || "";
    if (parsed.sizes !== undefined) data.sizes = parsed.sizes || "[]";
    if (parsed.colors !== undefined) data.colors = parsed.colors || "[]";
    if (parsed.video !== undefined) data.video = parsed.video || "";

    await prisma.product.create({ data });

    logger.info("Product created", { name: parsed.name, slug });
    revalidatePath("/admin/products");
    revalidatePath("/");
  } catch (err: any) {
    logger.error("createProduct failed", { error: err.message });
    throw new Error(err.message);
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = ProductSchema.parse(raw);

    let slug = parsed.slug || slugify(parsed.name);
    const dup = await prisma.product.findFirst({ where: { slug, id: { not: id } } });
    if (dup) slug = `${slug}-${Date.now()}`;

    const { tags: _t, sizes: _s, colors: _c, video: _v, ...rest } = parsed;
    const data: any = {
      ...rest,
      slug,
    };
    if (parsed.tags !== undefined) data.tags = parsed.tags || "";
    if (parsed.sizes !== undefined) data.sizes = parsed.sizes || "[]";
    if (parsed.colors !== undefined) data.colors = parsed.colors || "[]";
    if (parsed.video !== undefined) data.video = parsed.video || "";

    await prisma.product.update({ where: { id }, data });

    logger.info("Product updated", { id, name: parsed.name });
    revalidatePath("/admin/products");
    revalidatePath("/");
  } catch (err: any) {
    logger.error("updateProduct failed", { error: err.message });
    throw new Error(err.message);
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    logger.info("Product deleted", { id });
    revalidatePath("/admin/products");
    revalidatePath("/");
  } catch (err: any) {
    logger.error("deleteProduct failed", { error: err.message });
    throw new Error(err.message);
  }
}

export async function getProducts(categorySlug?: string, q?: string) {
  const where: any = { isVisible: true };

  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) where.categoryId = cat.id;
  }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
});

export const getCategories = cache(async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
});

export async function getAllProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleProductVisibility(id: string, isVisible: boolean) {
  await prisma.product.update({ where: { id }, data: { isVisible } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  await prisma.product.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isVisible: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}
