import type { Product, Category, Order, OrderItem } from "@prisma/client";

export type ProductWithCategory = Product & { category: Category | null };
export type OrderWithItems = Order & { items: (OrderItem & { product: Product })[] };
export type CartItem = { productId: string; name: string; price: number; quantity: number; image: string };
