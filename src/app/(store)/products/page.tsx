import type { Metadata } from "next";
import { getProducts, getCategories } from "@/actions/products";
import { ProductCard } from "@/components/store/product-card";
import { Package, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "جميع المنتجات — a&h store",
  description: "تصفح جميع المنتجات المتاحة في متجر a&h للأزياء",
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(category, q),
    getCategories(),
  ]);
  const activeCategory = categories.find((c) => c.slug === category);
  const title = q ? `نتائج البحث عن "${q}"` : activeCategory ? activeCategory.name : "جميع المنتجات";

  return (
    <div className="container-store py-6 md:py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-primary via-chart-4 to-accent rounded-full" />
          <div>
            <h1 className="section-title">{title}</h1>
            <p className="text-sm text-muted-foreground">{products.length} منتج</p>
          </div>
        </div>
        {(category || q) && (
          <Link href="/products">
            <Button variant="outline" size="sm" className="rounded-xl">عرض الكل</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/products">
          <Button variant={!category && !q ? "default" : "outline"} size="sm" className="rounded-lg">الكل</Button>
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/products?category=${c.slug}`}>
            <Button variant={category === c.slug ? "default" : "outline"} size="sm" className="rounded-lg">{c.name}</Button>
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-3xl border border-dashed">
          {q ? (
            <>
              <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg mb-2 font-medium">لا توجد نتائج للبحث عن &quot;{q}&quot;</p>
              <p className="text-sm">حاول البحث بكلمات أخرى</p>
            </>
          ) : (
            <>
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">لا توجد منتجات في هذه الفئة</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
