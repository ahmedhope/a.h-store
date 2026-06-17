import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { getColorName } from "@/lib/colors";
import { OrderStatusDropdown } from "@/components/admin/order-status-dropdown";
import { Search, ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import { deleteOrder } from "@/actions/orders";
import { DeleteButton } from "@/components/admin/delete-button";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار", confirmed: "تم التأكيد", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdmin();
  const { status, q } = await searchParams;

  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (q) {
    where.OR = [
      { customerName: { contains: q } },
      { customerPhone: { contains: q } },
      { id: { contains: q } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">الطلبات</h1>
          <p className="text-sm text-muted-foreground">{orders.length} طلب · إجمالي {formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <form>
            <input name="q" defaultValue={q || ""} placeholder="بحث باسم أو هاتف..." className="w-full h-10 pr-10 rounded-xl border border-border/50 bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" dir="rtl" />
          </form>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
            <Link key={s} href={`/admin/orders?${s === "all" ? "" : `status=${s}`}${q ? `&q=${q}` : ""}`}>
              <Badge variant={status === s || (!status && s === "all") ? "default" : "outline"} className="cursor-pointer rounded-lg px-3 py-1.5 whitespace-nowrap">
                {s === "all" ? "الكل" : statusLabels[s]}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border/50">
              <th className="text-right p-3 font-medium">#</th>
              <th className="text-right p-3 font-medium">العميل</th>
              <th className="text-right p-3 font-medium hidden md:table-cell">الهاتف</th>
              <th className="text-right p-3 font-medium hidden lg:table-cell">المنتجات</th>
              <th className="text-right p-3 font-medium">الإجمالي</th>
              <th className="text-right p-3 font-medium">الخصم</th>
              <th className="text-right p-3 font-medium">الحالة</th>
              <th className="text-right p-3 font-medium hidden md:table-cell">التاريخ</th>
              <th className="text-left p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                <td className="p-3 font-mono text-xs">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-3 font-medium">{order.customerName}</td>
                <td className="p-3 hidden md:table-cell" dir="ltr">{order.customerPhone}</td>
                <td className="p-3 hidden lg:table-cell">
                  <div className="text-xs space-y-0.5 max-w-[200px] truncate">
                    {order.items.map((item) => (
                      <span key={item.id} className="block truncate">{item.name} × {item.quantity}{item.size ? ` - مقاس ${item.size}` : ""}{item.color ? ` - ${getColorName(item.color)}` : ""}</span>
                    ))}
                  </div>
                </td>
                <td className="p-3 font-bold">{formatPrice(order.total)}</td>
                <td className="p-3 text-xs">{order.discount > 0 ? <span className="text-green-600">-{formatPrice(order.discount)}</span> : "—"}</td>
                <td className="p-3"><OrderStatusDropdown orderId={order.id} currentStatus={order.status} /></td>
                <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</td>
                <td className="p-3 text-left">
                  <div className="flex gap-1">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"><Eye className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <DeleteButton action={deleteOrder} id={order.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-muted/20">
          <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">لا توجد طلبات</p>
        </div>
      )}
    </div>
  );
}
