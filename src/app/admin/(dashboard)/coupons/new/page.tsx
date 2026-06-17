import { requireAdmin } from "@/lib/auth";
import { CouponForm } from "@/components/admin/coupon-form";

export default async function NewCouponPage() {
  await requireAdmin();
  return <CouponForm />;
}
