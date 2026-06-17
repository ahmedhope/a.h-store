"use client";

import { useState } from "react";
import type { ProductWithCategory } from "@/types";
import { formatPrice, parseImages } from "@/lib/utils";
import { parseColors, getColorName } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Play, Check, Share2, Sparkles, Heart, Minus, Plus, ChevronLeft } from "lucide-react";

interface ParsedSize { label: string; stock: number; }

export function ProductDetail({ product }: { product: ProductWithCategory }) {
  const images = parseImages(product.images);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const rawSizes: any[] = product.sizes ? JSON.parse(product.sizes) : [];
  const sizes: ParsedSize[] = rawSizes.map((s) => typeof s === "string" ? { label: s, stock: 999 } : s);
  const colors = parseColors(product.colors);

  const hasDiscount = product.compareAt && product.compareAt > product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.compareAt!) * 100) : 0;

  function addToCart() {
    try {
      const raw = document.cookie.split("cart=")[1]?.split(";")[0];
      const cart: any[] = raw ? JSON.parse(raw) : [];
      const key = `${product.id}-${selectedSize || ""}-${selectedColor || ""}`;
      const existing = cart.find((i: any) => i.key === key);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ key, productId: product.id, name: product.name, price: product.price, quantity, image: images[0] || "", size: selectedSize, color: selectedColor });
      }
      document.cookie = `cart=${JSON.stringify(cart)}; path=/; max-age=${60 * 60 * 24}`;
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      window.dispatchEvent(new Event("focus"));
    } catch { /* ignore */ }
  }

  function getWhatsAppLink() {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000";
    const msg = `مرحباً، أريد شراء:\n${product.name}\n${selectedSize ? `المقاس: ${selectedSize}\n` : ""}${selectedColor ? `اللون: ${getColorName(selectedColor)}\n` : ""}الكمية: ${quantity}\nالسعر: ${formatPrice(product.price * quantity)}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-12">
      <div className="space-y-4">
        <div className="aspect-square bg-gradient-to-br from-muted via-muted/50 to-muted rounded-3xl overflow-hidden relative shadow-xl border border-border/50 group/image">
          {images.length > 0 ? (
            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl font-black gradient-heading">
              {product.name[0]}
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {hasDiscount && (
              <span className="bg-gradient-to-l from-primary to-chart-4 text-primary-foreground text-sm font-bold px-3 py-1.5 rounded-full shadow-lg animate-scale-in">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-gradient-to-l from-chart-4 to-accent text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-scale-in">
                <Sparkles className="h-3.5 w-3.5" /> مميز
              </span>
            )}
          </div>
          {product.video && (
            <Button variant="secondary" size="sm" className="absolute bottom-4 left-4 shadow-lg gap-1.5 rounded-xl backdrop-blur-sm bg-background/80 hover:bg-background/90 transition-all duration-300 hover:scale-105" onClick={() => setShowVideo(!showVideo)}>
              <Play className="h-4 w-4 text-primary" />{showVideo ? "إخفاء" : "فيديو"}
            </Button>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${i === selectedImage ? "border-primary ring-2 ring-primary/30 shadow-lg scale-105" : "border-transparent hover:border-muted-foreground/30 opacity-70 hover:opacity-100 hover:scale-105"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        {showVideo && product.video && (
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-border/50 animate-scale-in">
            <iframe src={product.video.replace("watch?v=", "embed/").split("&")[0]} className="w-full h-full" allowFullScreen title="product video" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div>
          {product.category && (
            <span className="text-xs md:text-sm bg-gradient-to-l from-primary/10 to-chart-4/10 text-primary px-3 py-1 rounded-full inline-block mb-3 border border-primary/20 font-medium">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">{product.name}</h1>
        </div>

        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl md:text-5xl font-bold text-primary">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <>
              <span className="text-lg md:text-xl text-muted-foreground line-through">{formatPrice(product.compareAt!)}</span>
              <span className="text-sm bg-destructive/10 text-destructive font-bold px-2.5 py-0.5 rounded-full">وفر {discountPercent}%</span>
            </>
          )}
        </div>

        {product.description && (
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base border-r-2 border-primary/30 pr-4">{product.description}</p>
        )}

        {sizes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-3">المقاس {selectedSize && <span className="text-primary">: {selectedSize}</span>}</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button key={s.label} onClick={() => setSelectedSize(s.label)} disabled={s.stock <= 0} className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 active:scale-95 ${selectedSize === s.label ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105" : s.stock <= 0 ? "border-destructive/30 text-destructive/50 line-through cursor-not-allowed" : "border-border hover:border-primary hover:bg-primary/5 hover:shadow-sm hover:scale-105"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-3">اللون {selectedColor && <span className="text-primary">: {selectedColor}</span>}</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button key={c.name} onClick={() => setSelectedColor(c.name)} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm transition-all duration-300 active:scale-95 ${selectedColor === c.name ? "border-primary bg-primary/5 shadow-md shadow-primary/10 scale-105" : "border-border hover:border-primary hover:bg-primary/5 hover:scale-105"}`}>
                  <span className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-black/5" style={{ backgroundColor: c.hex }} />
                  {c.name}
                  {selectedColor === c.name && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-muted/50 border border-border/50">
          <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-destructive"} animate-pulse-soft`} />
          <span className="text-muted-foreground">المخزون:</span>
          <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-destructive font-medium"}>
            {product.stock > 0 ? `متوفر — ${product.stock} قطعة` : "نفد من المخزون"}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-1 bg-muted rounded-xl border border-border/50 p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-lg hover:bg-background transition-all flex items-center justify-center active:scale-90">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-9 h-9 rounded-lg hover:bg-background transition-all flex items-center justify-center active:scale-90">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={addToCart} disabled={added} size="lg" className="rounded-xl text-base gap-2.5 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-l from-primary to-chart-4 hover:from-chart-4 hover:to-primary text-primary-foreground border-0 flex-1 btn-shine active:scale-95">
                <ShoppingCart className="h-5 w-5" />
                {added ? "تمت الإضافة ✓" : "أضف للسلة"}
              </Button>
            </>
          )}
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 hover:border-primary hover:text-primary transition-all duration-300 active:scale-90" onClick={() => setWishlisted(!wishlisted)}>
            <Heart className={`h-5 w-5 transition-all duration-300 ${wishlisted ? "fill-primary text-primary scale-110" : ""}`} />
          </Button>
          <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 hover:border-chart-4 hover:text-chart-4 transition-all duration-300 active:scale-90">
              <Share2 className="h-5 w-5" />
            </Button>
          </a>
        </div>

        {product.tags && (
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/50">
            {product.tags.split(",").map((tag, i) => (
              <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all hover:scale-105 ${
                i % 3 === 0 ? "bg-primary/10 text-primary hover:bg-primary/20" : i % 3 === 1 ? "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20" : "bg-accent/10 text-accent-foreground hover:bg-accent/20"
              }`}>
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
