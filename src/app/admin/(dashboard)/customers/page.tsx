import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, ShoppingBag, Calendar, DollarSign, MapPin, TrendingUp } from "lucide-react";

export default async function AdminCustomersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    select: { customerPhone: true, customerName: true, total: true, discount: true, status: true, createdAt: true, id: true },
    orderBy: { createdAt: "desc" },
  });

  const customerMap = new Map<string, { name: string; phones: Set<string>; orders: number; total: number; firstOrder: Date; lastOrder: Date; statuses: Record<string, number> }>();

  for (const o of orders) {
    const key = o.customerPhone;
    if (!customerMap.has(key)) {
      customerMap.set(key, { name: o.customerName, phones: new Set([key]), orders: 0, total: 0, firstOrder: o.createdAt, lastOrder: o.createdAt, statuses: {} });
    }
    const c = customerMap.get(key)!;
    c.orders++;
    c.total += o.total;
    c.statuses[o.status] = (c.statuses[o.status] || 0) + 1;
    if (o.createdAt < c.firstOrder) c.firstOrder = o.createdAt;
    if (o.createdAt > c.lastOrder) c.lastOrder = o.createdAt;
  }

  const customers = Array.from(customerMap.entries())
    .map(([phone, data]) => ({ phone, ...data }))
    .sort((a, b) => b.total - a.total);

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + c.total, 0);
  const avgOrderValue = totalRevenue / orders.length || 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">العملاء</h1>
        <p className="text-sm text-muted-foreground">{totalCustomers} عميل · إجمالي المشتريات {formatPrice(totalRevenue)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "إجمالي العملاء", value: totalCustomers, icon: Phone, color: "from-purple-500 to-violet-600" },
          { label: "إجمالي المشتريات", value: formatPrice(totalRevenue), icon: DollarSign, color: "from-emerald-500 to-green-600" },
          { label: "متوسط قيمة الطلب", value: formatPrice(avgOrderValue), icon: TrendingUp, color: "from-blue-500 to-cyan-600" },
          { label: "إجمالي الطلبات", value: orders.length, icon: ShoppingBag, color: "from-indigo-500 to-blue-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium">{stat.label}</CardTitle>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent><p className="text-lg font-bold">{stat.value}</p></CardContent>
            </Card>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border/50">
              <th className="text-right p-3 font-medium">#</th>
              <th className="text-right p-3 font-medium">العميل</th>
              <th className="text-right p-3 font-medium">الهاتف</th>
              <th className="text-right p-3 font-medium">الطلبات</th>
              <th className="text-right p-3 font-medium">الإجمالي</th>
              <th className="text-right p-3 font-medium hidden md:table-cell">آخر طلب</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.phone} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                <td className="p-3 text-muted-foreground text-xs">{i + 1}</td>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3" dir="ltr">{c.phone}</td>
                <td className="p-3"><Badge variant={c.orders >= 3 ? "default" : "secondary"} className="rounded-lg">{c.orders}</Badge></td>
                <td className="p-3 font-bold">{formatPrice(c.total)}</td>
                <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{new Date(c.lastOrder).toLocaleDateString("ar-EG")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {customers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-muted/20">
          <Phone className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">لا يوجد عملاء بعد</p>
        </div>
      )}
    </div>
  );
}
