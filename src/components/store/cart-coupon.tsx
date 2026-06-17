"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Percent, Check, X } from "lucide-react";

interface CouponResult {
  valid: boolean;
  error?: string;
  discount?: number;
  coupon?: { code: string; type: string; discount: number };
}

export function CartCoupon({ total, onDiscountChange }: { total: number; onDiscountChange: (d: number, code: string) => void }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<CouponResult | null>(null);
  const [applied, setApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  async function applyCoupon() {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&total=${total}`);
      const data = await res.json();
      setResult(data);
      if (data.valid) {
        setApplied(true);
        onDiscountChange(data.discount, code.trim().toUpperCase());
      }
    } catch { setResult({ valid: false, error: "فشل الاتصال" }); }
    setLoading(false);
  }

  function removeCoupon() {
    setCode("");
    setResult(null);
    setApplied(false);
    onDiscountChange(0, "");
  }

  return (
    <div className="border border-border/50 rounded-xl p-4 space-y-3 bg-card/50">
      <p className="text-sm font-medium flex items-center gap-2">
        <Percent className="h-4 w-4 text-primary" /> كود خصم
      </p>
      {!applied ? (
        <div className="flex gap-2">
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="أدخل الكود" className="rounded-xl text-sm font-mono uppercase" dir="ltr" />
          <Button onClick={applyCoupon} disabled={loading || !code.trim()} size="sm" className="rounded-xl shrink-0 bg-gradient-to-l from-primary to-chart-4">
            {loading ? "..." : "تطبيق"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-bold font-mono text-green-700 dark:text-green-400">{result?.coupon?.code}</span>
            <span className="text-xs text-green-600">-{result?.coupon?.type === "percentage" ? `${result?.coupon?.discount}%` : `${result?.discount}₤`}</span>
          </div>
          <button onClick={removeCoupon} className="text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {result?.error && !applied && <p className="text-xs text-destructive">{result.error}</p>}
    </div>
  );
}
