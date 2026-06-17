"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cookies } from "next/headers";

const orderSchema = z.object({
  customerName: z.string().min(1, "الاسم مطلوب"),
  customerPhone: z.string().min(7, "رقم الهاتف غير صحيح"),
  customerNotes: z.string().default(""),
  couponCode: z.string().default(""),
  discount: z.coerce.number().default(0),
});

export async function createOrder(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = orderSchema.parse(raw);

    const cookieStore = await cookies();
    const cartRaw = cookieStore.get("cart")?.value;
    if (!cartRaw) return { error: "السلة فارغة" };

    const cart = JSON.parse(cartRaw);
    if (cart.length === 0) return { error: "السلة فارغة" };

    const productIds = cart.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const item of cart) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) return { error: `المنتج "${item.name}" غير موجود` };
      if (dbProduct.stock < item.quantity) {
        return { error: `المنتج "${item.name}" — الكمية المطلوبة (${item.quantity}) تتجاوز المخزون (${dbProduct.stock})` };
      }
    }

    let subtotal = 0;
    const items = cart.map((item: any) => {
      subtotal += item.price * item.quantity;
      const dbProduct = productMap.get(item.productId);
      return { productId: item.productId, name: dbProduct?.name || item.name, price: item.price, quantity: item.quantity, size: item.size || "", color: item.color || "" };
    });

    const total = Math.max(0, subtotal - parsed.discount);

    const order = await prisma.order.create({
      data: {
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        customerNotes: parsed.customerNotes,
        total,
        discount: parsed.discount,
        couponCode: parsed.couponCode,
        items: { create: items },
      },
    });

    // Increment coupon usage
    if (parsed.couponCode) {
      await prisma.coupon.update({
        where: { code: parsed.couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    for (const item of cart) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    cookieStore.set("cart", "[]", { path: "/", maxAge: 60 * 60 * 24 });

    revalidatePath("/");
    logger.info("Order created", { orderId: order.id, total, discount: parsed.discount, coupon: parsed.couponCode, customer: parsed.customerName });
    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    logger.error("Order creation failed", error);
    return { error: "فشل إنشاء الطلب، يرجى المحاولة مرة أخرى" };
  }
}

export async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    logger.error("Failed to fetch orders", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  logger.info("Order status updated", { orderId, status });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });
    revalidatePath("/admin/orders");
    logger.info("Order deleted", { id });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "فشل حذف الطلب" };
  }
}
