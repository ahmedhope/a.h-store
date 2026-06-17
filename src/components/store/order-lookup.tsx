"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getColorName } from "@/lib/colors";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Phone, Calendar, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function OrderLookup() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/lookup?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setOrders(data.orders);
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">الاستعلام عن طلب</h1>
        <p className="text-muted-foreground">أدخل رقم الهاتف للاستعلام عن طلباتك</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="رقم الهاتف"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className="h-11"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-11 rounded-xl gap-2">
              <Search className="h-4 w-4" />
              {loading ? "..." : "بحث"}
            </Button>
          </form>
          {error && <p className="text-sm text-destructive mt-3">{error}</p>}
        </CardContent>
      </Card>

      {orders && orders.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>لا توجد طلبات بهذا الرقم</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">طلب #{order.id.slice(0, 8)}</CardTitle>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    order.status === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {order.status === "completed" ? "مكتمل" : order.status === "cancelled" ? "ملغي" : "قيد الانتظار"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                </div>
                <div className="space-y-1">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name}{item.size ? ` - ${item.size}` : ""}{item.color ? ` (${getColorName(item.color)})` : ""}</span>
                      <span className="text-muted-foreground">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>المجموع</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
