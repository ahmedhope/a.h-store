import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import { OrderStatusDropdown } from "@/components/admin/order-status-dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Phone, User, Calendar, Hash, Percent, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="p-2 hover:bg-muted rounded-xl transition-colors"><ArrowRight className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">طلب #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-muted-foreground">تفاصيل الطلب</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-primary" />بيانات العميل</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">الاسم</span><span className="font-medium">{order.customerName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">الهاتف</span><span dir="ltr" className="font-medium">{order.customerPhone}</span></div>
            {order.customerNotes && <div className="flex justify-between"><span className="text-muted-foreground">ملاحظات</span><span>{order.customerNotes}</span></div>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Hash className="h-4 w-4 text-primary" />معلومات الطلب</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">الحالة</span>
              <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">التاريخ</span><span>{new Date(order.createdAt).toLocaleDateString("ar-EG")}</span></div>
            {order.couponCode && <div className="flex justify-between"><span className="text-muted-foreground">كود خصم</span><code className="bg-muted px-2 py-0.5 rounded text-xs font-bold">{order.couponCode}</code></div>}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-primary" />المنتجات</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{formatPrice(item.price)}</span>
                    {item.size && <span className="bg-muted px-1.5 py-0.5 rounded">مقاس {item.size}</span>}
                    {item.color && <span className="bg-muted px-1.5 py-0.5 rounded">{item.color}</span>}
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/50 mt-3 pt-3 space-y-1.5">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">المجموع الفرعي</span><span>{formatPrice(order.total + order.discount)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-destructive">الخصم</span><span className="text-destructive">-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between font-bold text-lg"><span>الإجمالي</span><span className="text-primary">{formatPrice(order.total)}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
