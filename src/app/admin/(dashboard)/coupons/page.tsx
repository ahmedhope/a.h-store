import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, XCircle, Percent } from "lucide-react";
import { CopyButton } from "@/components/admin/copy-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatPrice } from "@/lib/utils";
import { toggleCoupon, deleteCoupon } from "@/actions/coupons";
import Link from "next/link";

export default async function AdminCouponsPage() {
  await requireAdmin();
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">أكواد الخصم</h1>
          <p className="text-sm text-muted-foreground">إدارة أكواد الخصم والعروض</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button className="rounded-xl gap-2 bg-gradient-to-l from-primary to-chart-4 shadow-md">
            <Plus className="h-4 w-4" /> كود خصم جديد
          </Button>
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className="border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all card-hover bg-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-chart-4/10 flex items-center justify-center">
                  <Percent className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <code className="bg-muted px-2.5 py-1 rounded-lg text-sm font-mono font-bold tracking-wider">{c.code}</code>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.type === "percentage" ? `${c.discount}%` : formatPrice(c.discount)} خصم</p>
                </div>
              </div>
              <form action={toggleCoupon.bind(null, c.id, !c.isActive)}>
                <button type="submit" className={c.isActive ? "text-green-500 hover:text-green-600" : "text-muted-foreground hover:text-destructive"}>
                  {c.isActive ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </button>
              </form>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>الاستخدام:</span><span>{c.usedCount}{c.maxUses > 0 ? ` / ${c.maxUses}` : ""}</span></div>
              {c.minOrder > 0 && <div className="flex justify-between"><span>الحد الأدنى:</span><span>{formatPrice(c.minOrder)}</span></div>}
              {c.expiresAt && <div className="flex justify-between"><span>صلاحية حتى:</span><span>{new Date(c.expiresAt).toLocaleDateString("ar-EG")}</span></div>}
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
              <Link href={`/admin/coupons/${c.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full rounded-xl border-border/50">تعديل</Button>
              </Link>
              <DeleteButton action={deleteCoupon} id={c.id} size="sm" label="حذف" className="text-destructive hover:bg-destructive/10 rounded-xl" />
              <CopyButton code={c.code} />
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-muted/20">
            <Percent className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">لا توجد أكواد خصم</p>
            <p className="text-sm mt-1">أضف أول كود خصم الآن!</p>
          </div>
        )}
      </div>
    </div>
  );
}
