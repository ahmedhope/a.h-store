import type { Metadata } from "next";
import { CartContent } from "@/components/store/cart-content";

export const metadata: Metadata = {
  title: "سلة التسوق — a&h",
  description: "سلة التسوق الخاصة بك في متجر a&h للأزياء",
};

export default function CartPage() {
  return (
    <div className="container-store py-6 md:py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-gradient-to-b from-primary via-chart-4 to-accent rounded-full" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">سلة التسوق</h1>
          <p className="text-sm text-muted-foreground">راجع مشترياتك وأكمل الطلب</p>
        </div>
      </div>
      <CartContent />
    </div>
  );
}
