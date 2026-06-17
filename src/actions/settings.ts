"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

const DEFAULTS: Record<string, string> = {
  announcement_text: "توصيل مجاني للطلبات فوق 500 جنيه 🚚",
  announcement_bg: "from-primary to-chart-4",
  announcement_textColor: "text-white",
  announcement_active: "true",
  feature_1_icon: "Truck",
  feature_1_title: "شحن سريع",
  feature_1_desc: "توصيل لجميع المحافظات خلال 3-7 أيام",
  feature_1_color: "from-blue-500 to-blue-600",
  feature_2_icon: "RotateCcw",
  feature_2_title: "إرجاع مجاني",
  feature_2_desc: "إمكانية الإرجاع خلال 14 يوم",
  feature_2_color: "from-green-500 to-emerald-600",
  feature_3_icon: "ShieldCheck",
  feature_3_title: "جودة مضمونة",
  feature_3_desc: "خامات عالية الجودة ومريحة",
  feature_3_color: "from-purple-500 to-violet-600",
  feature_4_icon: "Headphones",
  feature_4_title: "دعم فوري",
  feature_4_desc: "فريق خدمة عملاء متاح 24/7",
  feature_4_color: "from-amber-500 to-orange-600",
  hero_title: "أزياء تعكس أناقتك",
  hero_subtitle: "اكتشف أحدث صيحات الموضة العصرية. تشكيلة مميزة من الملابس لكل الأذواق.",
  hero_badge: "تشكيلة صيف 2026 — تصاميم حصرية",
  social_facebook: "",
  social_instagram: "",
  social_tiktok: "",
  social_youtube: "",
  social_twitter: "",
  social_snapchat: "",
  social_telegram: "",
  social_linkedin: "",
};

export async function getSiteSetting(key: string): Promise<string> {
  try {
    const s = await prisma.siteSetting.findUnique({ where: { key } });
    return s?.value ?? DEFAULTS[key] ?? "";
  } catch { return DEFAULTS[key] ?? ""; }
}

export const getAllSettings = cache(async (): Promise<Record<string, string>> => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    return { ...DEFAULTS, ...map };
  } catch { return { ...DEFAULTS }; }
});

export async function saveSettings(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user?.email) return { error: "غير مصرح" };

  try {
    const raw = Object.fromEntries(formData);
    const keys = Object.keys(DEFAULTS);

    for (const key of keys) {
      const val = (raw[key] as string) || "";
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: val },
        create: { key, value: val },
      });
    }

    logger.info("Site settings updated");
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    logger.error("saveSettings failed", err);
    return { error: "فشل الحفظ" };
  }
}
