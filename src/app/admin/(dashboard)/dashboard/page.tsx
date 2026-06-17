import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Tags, AlertTriangle, TrendingUp, DollarSign, Users, Eye, Percent, Activity, Clock, Zap } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  await requireAdmin();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [products, orders, categories, lowStock, monthOrders, weekOrders, totalRevenue, monthRevenue, customersData, featured, coupons] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.product.count({ where: { stock: { lte: 5 }, isVisible: true } }),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: monthStart } } }),
    prisma.order.groupBy({ by: ["customerPhone"], _count: true }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.coupon.count({ where: { isActive: true } }),
  ]);

  const pendingOrders = await prisma.order.count({ where: { status: "pending" } });
  const shippedOrders = await prisma.order.count({ where: { status: "shipped" } });
  const completedOrders = await prisma.order.count({ where: { status: "completed" } });

  const recentOrders = await prisma.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const topProducts = await prisma.orderItem.groupBy({
    by: ["name"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lte: 5 }, isVisible: true },
    select: { id: true, name: true, stock: true, slug: true },
    take: 5,
    orderBy: { stock: "asc" },
  });

  const customers = customersData.length;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    return map[status] || "bg-gray-100";
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">نظرة عامة على المتجر</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
          <Clock className="h-3.5 w-3.5" />
          آخر تحديث: {now.toLocaleTimeString("ar-EG")}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {[
          { label: "إجمالي المنتجات", value: products, icon: Package, color: "from-blue-500 to-blue-600", href: "/admin/products" },
          { label: "الطلبات هذا الشهر", value: monthOrders, icon: TrendingUp, color: "from-green-500 to-emerald-600", href: "/admin/orders" },
          { label: "إيرادات الشهر", value: formatPrice(monthRevenue._sum.total || 0), icon: DollarSign, color: "from-emerald-500 to-green-600" },
          { label: "العملاء", value: customers, icon: Users, color: "from-purple-500 to-violet-600", href: "/admin/customers" },
          { label: "مخزون منخفض", value: lowStock, icon: AlertTriangle, color: "from-red-500 to-rose-600", href: "/admin/products" },
          { label: "منتجات مميزة", value: featured, icon: Eye, color: "from-amber-500 to-orange-600", href: "/admin/products" },
          { label: "جميع الطلبات", value: orders, icon: ShoppingBag, color: "from-indigo-500 to-blue-600", href: "/admin/orders" },
          { label: "الفئات", value: categories, icon: Tags, color: "from-pink-500 to-rose-600", href: "/admin/categories" },
          { label: "كوبونات نشطة", value: coupons, icon: Percent, color: "from-teal-500 to-cyan-600", href: "/admin/coupons" },
          { label: "قيد الانتظار", value: pendingOrders, icon: Activity, color: "from-yellow-500 to-amber-600", href: "/admin/orders" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href || "#"} className="group">
              <Card className="card-hover border-border/50 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs md:text-sm font-medium">{stat.label}</CardTitle>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="border-border/50 shadow-sm md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" />أحدث الطلبات</CardTitle>
            <Link href="/admin/orders"><Button variant="outline" size="sm" className="rounded-xl text-xs border-border/50">عرض الكل</Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-4 md:px-6 py-3 hover:bg-muted/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{o.customerName}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusBadge(o.status)}`}>{o.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{o.items.length} منتج · {o.customerPhone}</p>
                  </div>
                  <div className="text-left shrink-0 mr-3">
                    <p className="font-bold text-sm">{formatPrice(o.total)}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && <p className="text-sm text-muted-foreground p-6 text-center">لا توجد طلبات بعد</p>}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Top Products */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />أكثر المنتجات مبيعاً</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-gradient-to-br from-amber-500 to-orange-600" : i === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500" : i === 2 ? "bg-gradient-to-br from-amber-700 to-amber-800" : "bg-muted-foreground/30"}`}>{i + 1}</span>
                      <span className="text-sm truncate">{p.name}</span>
                    </div>
                    <span className="text-sm font-bold">{p._sum.quantity}</span>
                  </div>
                ))}
                {topProducts.length === 0 && <p className="text-sm text-muted-foreground">لا توجد مبيعات بعد</p>}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" />مخزون منخفض</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-sm truncate">{p.name}</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${p.stock <= 0 ? "bg-destructive/10 text-destructive" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"}`}>{p.stock}</span>
                  </div>
                ))}
                {lowStockProducts.length === 0 && <p className="text-sm text-muted-foreground">جميع المنتجات متوفرة</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products/new"><Button className="rounded-xl gap-2 bg-gradient-to-l from-primary to-chart-4 shadow-md"><Package className="h-4 w-4" />إضافة منتج</Button></Link>
        <Link href="/admin/coupons/new"><Button variant="outline" className="rounded-xl gap-2 border-border/50"><Percent className="h-4 w-4" />إضافة كود خصم</Button></Link>
        <Link href="/admin/categories"><Button variant="outline" className="rounded-xl gap-2 border-border/50"><Tags className="h-4 w-4" />إدارة الفئات</Button></Link>
      </div>
    </div>
  );
}
