import type { Metadata } from "next";
import { getProducts, getCategories, getFeaturedProducts } from "@/actions/products";
import { ProductCard } from "@/components/store/product-card";
import { HeroSection } from "@/components/store/hero-section";
import { getAllSettings } from "@/actions/settings";
import Link from "next/link";
import { ArrowLeft, Sparkles, Truck, RotateCcw, ShieldCheck, Headphones, Zap, Star, Heart, Package, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Truck, RotateCcw, ShieldCheck, Headphones, Zap, Star, Heart, Package, Clock, Award };

const gradientMap: Record<string, string> = {
  "from-blue-500 to-blue-600": "from-blue-500 to-blue-600",
  "from-green-500 to-emerald-600": "from-green-500 to-emerald-600",
  "from-purple-500 to-violet-600": "from-purple-500 to-violet-600",
  "from-amber-500 to-orange-600": "from-amber-500 to-orange-600",
  "from-red-500 to-rose-600": "from-red-500 to-rose-600",
  "from-primary to-chart-4": "from-primary to-chart-4",
  "from-teal-500 to-cyan-600": "from-teal-500 to-cyan-600",
  "from-pink-500 to-fuchsia-600": "from-pink-500 to-fuchsia-600",
};

export const metadata: Metadata = {
  title: "a&h store — أزياء عصرية",
  description: "متجر a&h للأزياء — أحدث التشكيلات والملابس العصرية",
};

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams;
  const [products, categories, featured, settings] = await Promise.all([
    getProducts(category, q),
    getCategories(),
    getFeaturedProducts(),
    getAllSettings(),
  ]);
  const activeCategory = categories.find((c) => c.slug === category);

  const title = q ? `نتائج البحث عن "${q}"` : activeCategory ? activeCategory.name : "أحدث التشكيلات";
  const showHero = !category && !q;

  const features = [1, 2, 3, 4].map((i) => ({
    icon: iconMap[settings[`feature_${i}_icon`]] || Truck,
    title: settings[`feature_${i}_title`] || "",
    desc: settings[`feature_${i}_desc`] || "",
    color: gradientMap[settings[`feature_${i}_color`]] || "from-primary to-chart-4",
  }));

  return (
    <>
      {showHero && <HeroSection categories={categories} settings={settings} />}

      {showHero && (
        <section className="container-store -mt-8 md:-mt-12 relative z-10">
          <div className="bg-background/90 backdrop-blur-xl rounded-2xl border border-primary/10 shadow-xl p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {showHero && featured.length > 0 && (
        <section className="container-store py-16 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-primary via-chart-4 to-accent rounded-full" />
              <div>
                <h2 className="section-title">منتجات مميزة</h2>
                <p className="text-sm text-muted-foreground">تشكيلتنا الأكثر طلباً</p>
              </div>
            </div>
            <Link href="/" className="text-sm text-primary hover:text-chart-4 transition-colors flex items-center gap-1 font-medium">
              عرض الكل <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="container-store py-8 md:py-12 pb-16 md:pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-chart-2 via-primary to-chart-5 rounded-full" />
            <div>
              <h1 className="section-title">{title}</h1>
              {!q && !activeCategory && <p className="text-sm text-muted-foreground">تصفح جميع المنتجات المتاحة</p>}
            </div>
          </div>
          {(category || q) && (
            <Link href="/" className="text-sm text-primary hover:text-chart-4 transition-colors flex items-center gap-1 font-medium">
              عرض الكل <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {q && products.length === 0 && (
          <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-3xl border border-dashed">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg mb-2 font-medium">لا توجد نتائج للبحث عن &quot;{q}&quot;</p>
            <p className="text-sm">حاول البحث بكلمات أخرى مثل: فستان، قميص، بنطلون...</p>
          </div>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!q && products.length === 0 && (
          <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-3xl border border-dashed">
            <p className="font-medium">لا توجد منتجات متاحة حالياً</p>
          </div>
        )}
      </section>

      {showHero && (
        <section className="container-store pb-16 md:pb-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-chart-4 to-accent rounded-3xl p-8 md:p-14 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">تواصل معنا عبر واتساب</h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto text-lg">للاستفسار عن المنتجات أو طلب قطع خاصة، تواصل معنا مباشرة على واتساب</p>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000"}`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-xl text-base gap-2.5 shadow-xl hover:shadow-2xl transition-all bg-white text-primary hover:bg-white/90 hover:scale-105">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  تواصل عبر واتساب
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
