"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { ProductWithCategory } from "@/types";

export function AddToCartButton({ product }: { product: ProductWithCategory }) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    try {
      const raw = document.cookie.split("cart=")[1]?.split(";")[0];
      const cart: any[] = raw ? JSON.parse(raw) : [];
      const key = `${product.id}-`;

      const existing = cart.find((i: any) => i.key === key);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, product.stock);
      } else {
        cart.push({ key, productId: product.id, name: product.name, price: product.price, quantity: 1, image: "" });
      }
      document.cookie = `cart=${JSON.stringify(cart)}; path=/; max-age=${60 * 60 * 24}`;
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      window.dispatchEvent(new Event("focus"));
    } catch { /* cookie parse error */ }
  };

  if (product.stock <= 0) return null;

  return (
    <Button onClick={addToCart} disabled={added} size="lg" className="w-full md:w-auto rounded-xl gap-2">
      <ShoppingCart className="h-5 w-5" />
      {added ? "تمت الإضافة ✓" : "أضف للسلة"}
    </Button>
  );
}
