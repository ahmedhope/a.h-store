import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ShoppingBag, Eye } from "lucide-react";
import type { Category } from "@/generated/prisma";

export function HeroSection({ categories, settings }: { categories: Category[]; settings?: Record<string, string> }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-background to-accent/[0.05] dark:from-primary/[0.05] dark:via-background dark:to-accent/[0.03]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-chart-4/5 via-transparent to-chart-2/5 rounded-full blur-3xl" />

      <div className="container-store relative py-12 md:py-24 lg:py-32">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center md:text-right order-2 md:order-1">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs md:text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm animate-scale-in">
              <Sparkles className="h-3.5 w-3.5" />
              {settings?.hero_badge || "تشكيلة صيف 2026 — تصاميم حصرية"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              {settings?.hero_title || "أزياء تعكس"}{" "}
              <span className="gradient-heading">أناقتك</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
              {settings?.hero_subtitle || "اكتشف أحدث صيحات الموضة العصرية. تشكيلات حصرية تنتظرك."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href={categories.length > 0 ? `/?category=${categories[0].slug}` : "/"}>
                <Button size="lg" className="rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-l from-primary to-chart-4 hover:from-chart-4 hover:to-primary text-primary-foreground border-0 gap-2 btn-shine group/btn">
                  تسوق الآن
                  <ShoppingBag className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="rounded-xl text-base border-2 hover:bg-accent/10 hover:border-accent transition-all duration-300 gap-2 group/btn">
                  <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  اكتشف المجموعة
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative bg-gradient-to-br from-primary/5 via-chart-4/5 to-accent/5 border border-primary/10 animate-float">
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-center space-y-6 p-8">
                    <div className="text-7xl md:text-8xl lg:text-9xl font-black gradient-heading tracking-tighter leading-none">a&h</div>
                    <div className="text-xl md:text-2xl font-light text-muted-foreground tracking-[0.3em] uppercase">store</div>
                    <div className="h-[2px] w-16 mx-auto bg-gradient-to-l from-primary via-chart-4 to-accent rounded-full" />
                    <div className="flex flex-wrap justify-center gap-2">
                      {categories.slice(0, 4).map((cat, i) => (
                        <Link key={cat.id} href={`/?category=${cat.slug}`}>
                          <span className={`inline-block px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-sm border transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer ${
                            i === 0 ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" :
                            i === 1 ? "bg-chart-4/15 text-chart-4 border-chart-4/30 hover:bg-chart-4/25" :
                            i === 2 ? "bg-accent/15 text-accent-foreground border-accent/30 hover:bg-accent/25" :
                            "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          }`}>
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-bl from-chart-4/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
