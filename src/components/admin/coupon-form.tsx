"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCoupon, updateCoupon } from "@/actions/coupons";
import { useRouter } from "next/navigation";
import { Percent, Save, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  coupon?: { id: string; code: string; discount: number; type: string; minOrder: number; maxUses: number; expiresAt: string | null };
}

export function CouponForm({ coupon }: Props) {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(form: FormData) {
    setMsg(""); setError("");
    const res = coupon
      ? await updateCoupon(coupon.id, form)
      : await createCoupon(form);
    if (res?.error) setError(res.error);
    else { setMsg("✅ تم الحفظ"); setTimeout(() => router.push("/admin/coupons"), 1000); }
  }

  return (
    <div className="max-w-lg mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/coupons" className="p-2 hover:bg-muted rounded-xl transition-colors"><ArrowRight className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold">{coupon ? "تعديل الكود" : "كود خصم جديد"}</h1>
      </div>
      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-primary" />بيانات كود الخصم</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>الكود</Label>
              <Input name="code" defaultValue={coupon?.code} required placeholder="مثال: SUMMER20" className="font-mono tracking-widest uppercase rounded-xl" dir="ltr" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>قيمة الخصم</Label>
                <Input name="discount" type="number" step="0.01" defaultValue={coupon?.discount} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>النوع</Label>
                <select name="type" defaultValue={coupon?.type || "percentage"} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="percentage">نسبة مئوية %</option>
                  <option value="fixed">قيمة ثابتة</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الحد الأدنى للطلب</Label>
                <Input name="minOrder" type="number" step="0.01" defaultValue={coupon?.minOrder || "0"} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>الحد الأقصى للاستخدام</Label>
                <Input name="maxUses" type="number" defaultValue={coupon?.maxUses || "0"} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>تاريخ الانتهاء (اختياري)</Label>
              <Input name="expiresAt" type="date" defaultValue={coupon?.expiresAt?.split("T")[0] || ""} className="rounded-xl" />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-lg">{error}</p>}
            {msg && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-2 rounded-lg">{msg}</p>}
            <Button type="submit" className="w-full rounded-xl gap-2 bg-gradient-to-l from-primary to-chart-4 shadow-md">
              <Save className="h-4 w-4" /> حفظ
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
