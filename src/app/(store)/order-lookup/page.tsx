import { OrderLookup } from "@/components/store/order-lookup";

export const metadata = {
  title: "الاستعلام عن طلب — a&h store",
  description: "استعلام عن حالة طلبك في متجر a&h باستخدام رقم الهاتف",
};

export default function OrderLookupPage() {
  return (
    <div className="container-store py-8 md:py-12">
      <OrderLookup />
    </div>
  );
}
