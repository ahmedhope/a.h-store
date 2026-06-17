"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Phone, User, FileText, MessageSquare } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartCoupon } from "./cart-coupon";

export function CartContent() {
  const [cart, setCart] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const router = useRouter();

  const loadCart = useCallback(() => {
    try {
      const c = JSON.parse(document.cookie.split("cart=")[1]?.split(";")[0] || "[]");
      setCart(c);
    } catch { setCart([]); }
  }, []);

  useEffect(() => {
    loadCart();
    window.addEventListener("focus", loadCart);
    return () => window.removeEventListener("focus", loadCart);
  }, [loadCart]);

  const updateQuantity = (key: string, delta: number) => {
    const item = cart.find((i: any) => i.key === key);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; max-age=${60 * 60 * 24}`;
    loadCart();
  };

  const removeItem = (key: string) => {
    const updated = cart.filter((i: any) => i.key !== key);
    document.cookie = `cart=${JSON.stringify(updated)}; path=/; max-age=${60 * 60 * 24}`;
    loadCart();
  };

  const subtotal = cart.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError("");
    formData.set("couponCode", couponCode);
    formData.set("discount", String(discount));
    const result = await createOrder(formData);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success && result.order) {
      const { order } = result;
      const itemsText = cart.map((i: any) => `• ${i.name}${i.size ? ` - مقاس ${i.size}` : ""}${i.color ? ` (${i.color})` : ""} × ${i.quantity} = ${formatPrice(i.price * i.quantity)}`).join("\n");
      const message = encodeURIComponent(
        `طلب جديد من متجر a&h:\n\nالعميل: ${formData.get("customerName")}\nالهاتف: ${formData.get("customerPhone")}\n\nالمنتجات:\n${itemsText}\n${couponCode ? `\nكود خصم: ${couponCode} (توفير ${formatPrice(discount)})` : ""}\nالإجمالي: ${formatPrice(order.total)}\n\nرقم الطلب: ${order.id.slice(-6).toUpperCase()}`
      );
      const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000";
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      document.cookie = `cart=[]; path=/; max-age=0`;
      router.push("/");
    }
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-chart-4/10 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="h-10 w-10 text-primary" />
        </div>
        <p className="text-muted-foreground text-lg font-medium mb-1">السلة فارغة</p>
        <p className="text-sm text-muted-foreground mb-6">أضف بعض المنتجات الرائعة إلى سلتك!</p>
        <Link href="/"><Button className="rounded-xl gap-2 bg-gradient-to-l from-primary to-chart-4 shadow-lg hover:shadow-xl transition-all duration-300 btn-shine">
          <ArrowLeft className="h-4 w-4" /> تسوق الآن
        </Button></Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1 pb-2">
          <span className="font-medium">{cart.length} منتج في سلتك</span>
          <button onClick={() => { document.cookie = "cart=[]; path=/; max-age=0"; loadCart(); }} className="text-destructive hover:text-destructive/80 transition-colors text-xs">
            تفريغ السلة
          </button>
        </div>
        {cart.map((item: any) => (
          <div key={item.key || item.productId} className="flex items-center justify-between border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20 bg-card group">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate group-hover:text-primary transition-colors">{item.name}</h3>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1.5">
                <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
                {item.size && <span className="bg-gradient-to-l from-primary/10 to-chart-4/10 px-2 py-0.5 rounded-full text-primary border border-primary/10">{item.size}</span>}
                {item.color && <span className="bg-gradient-to-l from-accent/10 to-chart-2/10 px-2 py-0.5 rounded-full text-accent-foreground border border-accent/10">{item.color}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-0.5 border border-border/30">
                <button className="icon-btn h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => updateQuantity(item.key || item.productId, -1)}>
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button className="icon-btn h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => updateQuantity(item.key || item.productId, 1)}>
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <span className="font-bold min-w-[80px] text-left text-primary">{formatPrice(item.price * item.quantity)}</span>
              <button className="icon-btn h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 shrink-0" onClick={() => removeItem(item.key || item.productId)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <CartCoupon total={subtotal} onDiscountChange={(d, c) => { setDiscount(d); setCouponCode(c); }} />

        <form action={handleSubmit} className="border border-border/50 rounded-2xl p-6 space-y-5 shadow-sm bg-card hover:shadow-lg transition-all duration-300">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-chart-4 rounded-full" />
            معلومات الطلب
          </h2>

          <div className="space-y-2">
            <Label htmlFor="customerName" className="flex items-center gap-1.5 text-sm">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              الاسم
            </Label>
            <Input id="customerName" name="customerName" required placeholder="الاسم الكامل" className="rounded-xl border-border/50 focus-visible:border-primary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="flex items-center gap-1.5 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              رقم الجوال
            </Label>
            <Input id="customerPhone" name="customerPhone" required placeholder="05xxxxxxxx" dir="ltr" className="rounded-xl border-border/50 focus-visible:border-primary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerNotes" className="flex items-center gap-1.5 text-sm">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              ملاحظات
            </Label>
            <Textarea id="customerNotes" name="customerNotes" placeholder="أي ملاحظات إضافية" className="rounded-xl border-border/50 focus-visible:border-primary" />
          </div>

          <div className="border-t border-border/50 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">الخصم</span>
                <span className="text-green-600">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-1">
              <span>الإجمالي</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-xl">{error}</p>}

          <Button type="submit" className="w-full rounded-xl gap-2 bg-gradient-to-l from-primary to-chart-4 hover:from-chart-4 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 btn-shine active:scale-[0.98]" disabled={submitting} size="lg">
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                جاري المعالجة...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                إتمام الطلب عبر واتساب
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
