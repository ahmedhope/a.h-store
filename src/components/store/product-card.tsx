import Link from "next/link";
import type { ProductWithCategory } from "@/types";
import { formatPrice, parseImages } from "@/lib/utils";
import { ShoppingCart, Sparkles } from "lucide-react";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const images = parseImages(product.images);
  const outOfStock = product.stock <= 0;
  const hasDiscount = product.compareAt && product.compareAt > product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.compareAt!) * 100) : 0;

  return (
    <Link href={`/products/${product.slug}`} className={`group block ${outOfStock ? "opacity-70" : ""}`}>
      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl overflow-hidden mb-3 relative shadow-sm card-hover border border-border/50">
        {images.length > 0 ? (
          <img src={images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-black gradient-heading">
            {product.name[0]}
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
              نفذ من المخزون
            </span>
          </div>
        )}
        {hasDiscount && !outOfStock && (
          <span className="absolute top-3 right-3 bg-gradient-to-l from-primary to-chart-4 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-scale-in">
            -{discountPercent}% خصم
          </span>
        )}
        {product.isFeatured && !outOfStock && !hasDiscount && (
          <span className="absolute top-3 right-3 bg-gradient-to-l from-chart-4 to-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> مميز
          </span>
        )}
        <div className="absolute bottom-3 left-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-2 rounded-xl text-xs font-medium shadow-lg inline-flex items-center gap-1.5 border border-border/50">
            <ShoppingCart className="h-3.5 w-3.5 text-primary" />
            أضف للسلة
          </span>
        </div>
      </div>
      <div className="px-1 space-y-1.5">
        <div className="flex items-center gap-1.5">
          {product.category && (
            <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/10">{product.category.name}</span>
          )}
        </div>
        <p className="font-medium truncate text-sm md:text-base group-hover:text-primary transition-colors duration-300">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm md:text-base text-primary">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs md:text-sm text-muted-foreground line-through">{formatPrice(product.compareAt!)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
