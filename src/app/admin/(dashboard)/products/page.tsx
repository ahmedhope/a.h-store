import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Search, Eye, EyeOff, Star, Copy, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { deleteProduct, toggleProductVisibility, toggleProductFeatured } from "@/actions/products";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; stock?: string }> }) {
  await requireAdmin();
  const { q, category, stock } = await searchParams;

  const where: any = {};
  if (q) where.name = { contains: q };
  if (category) where.categoryId = category;
  if (stock === "low") where.stock = { lte: 5 };
  if (stock === "out") where.stock = 0;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <p className="text-sm text-muted-foreground">{products.length} منتج · قيمة المخزون {formatPrice(totalValue)}</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="rounded-xl gap-2 bg-gradient-to-l from-primary to-chart-4 shadow-md"><Plus className="h-4 w-4" />إضافة منتج</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <form>
            <input name="q" defaultValue={q || ""} placeholder="بحث عن منتج..." className="w-full h-10 pr-10 rounded-xl border border-border/50 bg-background px-3 text-sm" dir="rtl" />
          </form>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          <Link href="/admin/products"><Badge variant={!q && !category && !stock ? "default" : "outline"} className="cursor-pointer rounded-lg px-3 py-1.5 whitespace-nowrap">الكل</Badge></Link>
          <Link href="/admin/products?stock=low"><Badge variant={stock === "low" ? "default" : "outline"} className="cursor-pointer rounded-lg px-3 py-1.5 whitespace-nowrap">مخزون منخفض</Badge></Link>
          <Link href="/admin/products?stock=out"><Badge variant={stock === "out" ? "default" : "outline"} className="cursor-pointer rounded-lg px-3 py-1.5 whitespace-nowrap">نفد</Badge></Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/admin/products?category=${c.id}`}>
              <Badge variant={category === c.id ? "default" : "outline"} className="cursor-pointer rounded-lg px-3 py-1.5 whitespace-nowrap">{c.name}</Badge>
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border/50">
              <th className="text-right p-3 font-medium">المنتج</th>
              <th className="text-right p-3 font-medium hidden md:table-cell">الفئة</th>
              <th className="text-right p-3 font-medium">السعر</th>
              <th className="text-right p-3 font-medium">المخزون</th>
              <th className="text-right p-3 font-medium hidden lg:table-cell">حالة</th>
              <th className="text-left p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden shrink-0">
                      {product.images !== "[]" && (() => { try { const imgs = JSON.parse(product.images); return imgs[0] ? <img src={imgs[0]} alt="" className="w-full h-full object-cover" /> : null; } catch { return null; } })()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <div className="flex gap-1.5 mt-0.5">
                        {product.isFeatured && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                        {!product.isVisible && <EyeOff className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{product.category?.name || "—"}</td>
                <td className="p-3 font-bold">{formatPrice(product.price)}</td>
                <td className="p-3">
                  <Badge variant={product.stock <= 0 ? "destructive" : product.stock <= 5 ? "secondary" : "default"} className="rounded-lg">
                    {product.stock}
                  </Badge>
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <div className="flex gap-1">
                    <form action={toggleProductVisibility.bind(null, product.id, !product.isVisible)}>
                      <button className={`p-1.5 rounded-lg transition-colors ${product.isVisible ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-950" : "text-muted-foreground hover:bg-muted"}`}>
                        {product.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>
                    </form>
                    <form action={toggleProductFeatured.bind(null, product.id, !product.isFeatured)}>
                      <button className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950" : "text-muted-foreground hover:bg-muted"}`}>
                        <Star className={`h-3.5 w-3.5 ${product.isFeatured ? "fill-amber-500" : ""}`} />
                      </button>
                    </form>
                  </div>
                </td>
                <td className="p-3 text-left">
                  <div className="flex gap-1">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"><Edit className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Link href={`/products/${product.slug}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-chart-4/10 hover:text-chart-4"><Copy className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <DeleteButton action={deleteProduct} id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-muted/20">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">لا توجد منتجات</p>
          <Link href="/admin/products/new"><Button variant="outline" className="mt-3 rounded-xl">إضافة منتج</Button></Link>
        </div>
      )}
    </div>
  );
}
