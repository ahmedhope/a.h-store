const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");

const db = new Database(path.join(__dirname, "..", "dev.db"));

const DEFAULTS = {
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

const find = db.prepare("SELECT id FROM [SiteSetting] WHERE key = ?");
const update = db.prepare("UPDATE [SiteSetting] SET value = ?, updatedAt = datetime('now') WHERE id = ?");
const insert = db.prepare("INSERT INTO [SiteSetting] (id, key, value, updatedAt) VALUES (?, ?, ?, datetime('now'))");

const tx = db.transaction(() => {
  for (const [key, value] of Object.entries(DEFAULTS)) {
    const existing = find.get(key);
    if (existing) {
      update.run(value, existing.id);
    } else {
      insert.run(crypto.randomUUID(), key, value);
    }
  }
});

tx();
db.close();
console.log("✅ Seed settings inserted");
